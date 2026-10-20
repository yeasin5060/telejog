import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

// Format message for client consumption
const formatMessageForUser = (msg, currentUserId) => {
  const reactions = (msg.reactions || []).map((r) => ({
    emoji: r.emoji,
    count: r.count,
    userReacted: r.users
      ? r.users.some((u) => u.toString() === currentUserId.toString())
      : false,
  }));

  return {
    _id: msg._id,
    conversationId: msg.conversationId,
    sender: msg.sender?._id || msg.sender,
    senderDetails: typeof msg.sender === 'object' && msg.sender.name ? msg.sender : undefined,
    receiver: msg.receiver,
    text: msg.text || '',
    mediaUrl: msg.mediaUrl || '',
    mediaType: msg.mediaType || undefined,
    voiceDuration: msg.voiceDuration || undefined,
    read: msg.read,
    pinned: msg.pinned,
    reactions,
    replyTo: msg.replyTo,
    createdAt: msg.createdAt,
  };
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user._id;
    const { limit = 50, before } = req.query;

    const query = { conversationId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate('sender', 'name handle avatar')
      .sort({ createdAt: 1 })
      .limit(parseInt(limit));

    const formatted = messages.map((m) => formatMessageForUser(m, currentUserId));

    res.json({
      success: true,
      count: formatted.length,
      messages: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const {
      conversationId,
      receiver,
      text,
      mediaUrl,
      mediaType,
      voiceDuration,
      replyTo,
    } = req.body;

    if (!conversationId) {
      return res.status(400).json({ success: false, message: 'conversationId is required' });
    }

    if (!text && !mediaUrl) {
      return res.status(400).json({
        success: false,
        message: 'Message must contain either text or mediaUrl',
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const newMessage = await Message.create({
      conversationId,
      sender: currentUserId,
      receiver: receiver || undefined,
      text: text || '',
      mediaUrl: mediaUrl || '',
      mediaType: mediaType || null,
      voiceDuration: voiceDuration || '',
      replyTo: replyTo || undefined,
      read: false,
    });

    // Update conversation lastMessage & updatedAt
    conversation.lastMessage = newMessage._id;
    conversation.updatedAt = new Date();

    // Increment unread count for other participants
    if (!conversation.unreadCounts) {
      conversation.unreadCounts = new Map();
    }
    conversation.participants.forEach((pId) => {
      if (pId.toString() !== currentUserId.toString()) {
        const cur = conversation.unreadCounts.get(pId.toString()) || 0;
        conversation.unreadCounts.set(pId.toString(), cur + 1);
      }
    });

    await conversation.save();

    const populated = await Message.findById(newMessage._id).populate(
      'sender',
      'name handle avatar'
    );

    const formatted = formatMessageForUser(populated, currentUserId);

    res.status(201).json({
      success: true,
      message: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    React to a message
// @route   POST /api/messages/:id/react
// @access  Private
export const reactToMessage = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({ success: false, message: 'Emoji is required' });
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    let reactionGroup = message.reactions.find((r) => r.emoji === emoji);

    if (reactionGroup) {
      const userIndex = reactionGroup.users.indexOf(currentUserId);
      if (userIndex > -1) {
        // Toggle off
        reactionGroup.users.splice(userIndex, 1);
        reactionGroup.count = reactionGroup.users.length;
        if (reactionGroup.count === 0) {
          message.reactions = message.reactions.filter((r) => r.emoji !== emoji);
        }
      } else {
        // Add user
        reactionGroup.users.push(currentUserId);
        reactionGroup.count = reactionGroup.users.length;
      }
    } else {
      // New emoji reaction
      message.reactions.push({
        emoji,
        count: 1,
        users: [currentUserId],
      });
    }

    await message.save();

    const formatted = formatMessageForUser(message, currentUserId);

    res.json({
      success: true,
      messageId: message._id,
      reactions: formatted.reactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pin / Unpin message
// @route   PUT /api/messages/:id/pin
// @access  Private
export const pinMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.pinned = !message.pinned;
    await message.save();

    res.json({
      success: true,
      messageId: message._id,
      pinned: message.pinned,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Only sender can delete their message
    if (message.sender.toString() !== currentUserId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this message' });
    }

    await Message.deleteOne({ _id: message._id });

    res.json({
      success: true,
      message: 'Message deleted successfully',
      deletedId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all messages in conversation as read
// @route   PUT /api/messages/read/:conversationId
// @access  Private
export const markMessagesAsRead = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { conversationId } = req.params;

    await Message.updateMany(
      { conversationId, sender: { $ne: currentUserId }, read: false },
      { $set: { read: true }, $addToSet: { readBy: currentUserId } }
    );

    // Reset unread count for current user
    const conversation = await Conversation.findById(conversationId);
    if (conversation && conversation.unreadCounts) {
      conversation.unreadCounts.set(currentUserId.toString(), 0);
      await conversation.save();
    }

    res.json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    next(error);
  }
};
