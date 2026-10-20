import Story from '../models/Story.js';

// @desc    Get active stories grouped by user (matching UserStory interface)
// @route   GET /api/stories
// @access  Private
export const getStories = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    // Fetch non-expired stories
    const stories = await Story.find()
      .populate('user', 'name handle avatar isOnline lastSeen verified')
      .sort({ createdAt: -1 });

    // Group stories by user
    const userStoriesMap = new Map();

    stories.forEach((story) => {
      if (!story.user) return;
      const userId = story.user._id.toString();

      const isSeenByCurrentUser = story.viewers
        ? story.viewers.some((v) => v.toString() === currentUserId.toString())
        : false;

      const formattedStory = {
        _id: story._id,
        user: story.user,
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType,
        caption: story.caption || '',
        createdAt: story.createdAt,
        seen: isSeenByCurrentUser,
      };

      if (!userStoriesMap.has(userId)) {
        userStoriesMap.set(userId, {
          user: story.user,
          hasUnseen: !isSeenByCurrentUser,
          stories: [formattedStory],
        });
      } else {
        const group = userStoriesMap.get(userId);
        group.stories.push(formattedStory);
        if (!isSeenByCurrentUser) {
          group.hasUnseen = true;
        }
      }
    });

    const userStoriesList = Array.from(userStoriesMap.values());

    res.json({
      success: true,
      count: userStoriesList.length,
      userStories: userStoriesList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new story
// @route   POST /api/stories
// @access  Private
export const createStory = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { mediaUrl, mediaType = 'image', caption } = req.body;

    if (!mediaUrl) {
      return res.status(400).json({ success: false, message: 'mediaUrl is required' });
    }

    const story = await Story.create({
      user: currentUserId,
      mediaUrl,
      mediaType,
      caption: caption || '',
      viewers: [currentUserId], // Author has seen their own story
    });

    const populated = await Story.findById(story._id).populate(
      'user',
      'name handle avatar isOnline lastSeen verified'
    );

    res.status(201).json({
      success: true,
      story: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark story as viewed
// @route   PUT /api/stories/:id/view
// @access  Private
export const viewStory = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    if (!story.viewers.includes(currentUserId)) {
      story.viewers.push(currentUserId);
      await story.save();
    }

    res.json({
      success: true,
      message: 'Story marked as viewed',
      storyId: story._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete story
// @route   DELETE /api/stories/:id
// @access  Private
export const deleteStory = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    if (story.user.toString() !== currentUserId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this story' });
    }

    await Story.deleteOne({ _id: story._id });

    res.json({
      success: true,
      message: 'Story deleted successfully',
      deletedId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
