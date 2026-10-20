import User from '../models/User.js';

// @desc    Search users by name, handle, or phone
// @route   GET /api/users/search
// @access  Private
export const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      const users = await User.find({ _id: { $ne: req.user._id } })
        .limit(20)
        .select('-password');
      return res.json({ success: true, count: users.length, users });
    }

    const regex = new RegExp(q.trim().replace(/^@/, ''), 'i');

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [{ name: regex }, { handle: regex }, { phone: regex }, { email: regex }],
    })
      .limit(30)
      .select('-password');

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Contacts list)
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-password')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update online status
// @route   PUT /api/users/status
// @access  Private
export const updateStatus = async (req, res, next) => {
  try {
    const { isOnline, lastSeen } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (isOnline !== undefined) user.isOnline = isOnline;
    if (lastSeen !== undefined) user.lastSeen = lastSeen;

    await user.save();

    res.json({
      success: true,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
    });
  } catch (error) {
    next(error);
  }
};
