import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

// Format helper to convert DB conversation into Telejog Client format
const formatConversationForUser = (conv, currentUserId) => {
  const isDirect = conv.type === 'user';
  let participant = null;

  if (isDirect && conv.participants && conv.participants.length > 0) {
    participant = conv.participants.find(
      (p) => p._id && p._id.toString() !== currentUserId.toString()
    ) || conv.participants[0];
  }

  const isPinned = conv.pinnedBy
    ? conv.pinnedBy.some((id) => id.toString() === currentUserId.toString())
    : false;

  const isMuted = conv.mutedBy
    ? conv.mutedBy.some((id) => id.toString() === currentUserId.toString())
    : false;

  const unreadCount =
    (conv.unreadCounts && conv.unreadCounts.get(currentUserId.toString())) || 0;

  return {
    _id: conv._id,
    type: conv.type,
    title: conv.title || (participant ? participant.name : 'Direct Chat'),
    avatar: conv.avatar || (participant ? participant.avatar : ''),
    participant: participant || undefined,
    lastMessage: conv.lastMessage || undefined,
    unreadCount,
    isPinned,
    isMuted,
    isOnline: participant ? participant.isOnline : false,
    membersCount: conv.membersCount || conv.participants?.length || 2,
    updatedAt: conv.updatedAt,
    createdAt: conv.createdAt,
  };
};

// @desc    Get all conversations for current user
// @route   GET /api/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    const conversations = await Conversation.find({
      $or: [
        { participants: currentUserId },
        { type: { $in: ['channel', 'bot'] } }, // Channels/bots are accessible
      ],
    })
      .populate('participants', 'name email handle avatar isOnline lastSeen verified')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    const formatted = conversations.map((conv) =>
      formatConversationForUser(conv, currentUserId)
    );

    // Sort: pinned first, then by updatedAt desc
    formatted.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    res.json({
      success: true,
      count: formatted.length,
      conversations: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversation by ID
// @route   GET /api/conversations/:id
// @access  Private
export const getConversationById = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'name email handle avatar isOnline lastSeen verified')
      .populate('lastMessage');

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const formatted = formatConversationForUser(conversation, currentUserId);

    res.json({
      success: true,
      conversation: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get or create 1-on-1 conversation
// @route   POST /api/conversations/direct
// @access  Private
export const getOrCreateDirectConversation = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ success: false, message: 'recipientId is required' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient user not found' });
    }

    // Check if conversation already exists between these 2 users
    let conversation = await Conversation.findOne({
      type: 'user',
      participants: { $all: [currentUserId, recipientId], $size: 2 },
    })
      .populate('participants', 'name email handle avatar isOnline lastSeen verified')
      .populate('lastMessage');

    if (!conversation) {
      conversation = await Conversation.create({
        type: 'user',
        participants: [currentUserId, recipientId],
        membersCount: 2,
      });

      conversation = await Conversation.findById(conversation._id).populate(
        'participants',
        'name email handle avatar isOnline lastSeen verified'
      );
    }

    const formatted = formatConversationForUser(conversation, currentUserId);

    res.status(200).json({
      success: true,
      conversation: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a Group or Channel
// @route   POST /api/conversations/group
// @access  Private
export const createGroupOrChannel = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { title, type = 'group', avatar, participantIds = [] } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const allParticipants = Array.from(new Set([currentUserId.toString(), ...participantIds]));

    const conversation = await Conversation.create({
      title,
      type: ['group', 'channel', 'bot'].includes(type) ? type : 'group',
      avatar: avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200',
      participants: allParticipants,
      admin: currentUserId,
      membersCount: allParticipants.length,
    });

    const populated = await Conversation.findById(conversation._id).populate(
      'participants',
      'name email handle avatar isOnline lastSeen verified'
    );

    const formatted = formatConversationForUser(populated, currentUserId);

    res.status(201).json({
      success: true,
      conversation: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pin conversation
// @route   PUT /api/conversations/:id/pin
// @access  Private
export const togglePinConversation = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const pinnedIndex = conversation.pinnedBy.indexOf(currentUserId);
    let isPinned = false;

    if (pinnedIndex > -1) {
      conversation.pinnedBy.splice(pinnedIndex, 1);
      isPinned = false;
    } else {
      conversation.pinnedBy.push(currentUserId);
      isPinned = true;
    }

    await conversation.save();

    res.json({
      success: true,
      conversationId: conversation._id,
      isPinned,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle mute conversation
// @route   PUT /api/conversations/:id/mute
// @access  Private
export const toggleMuteConversation = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const mutedIndex = conversation.mutedBy.indexOf(currentUserId);
    let isMuted = false;

    if (mutedIndex > -1) {
      conversation.mutedBy.splice(mutedIndex, 1);
      isMuted = false;
    } else {
      conversation.mutedBy.push(currentUserId);
      isMuted = true;
    }

    await conversation.save();

    res.json({
      success: true,
      conversationId: conversation._id,
      isMuted,
    });
  } catch (error) {
    next(error);
  }
};
