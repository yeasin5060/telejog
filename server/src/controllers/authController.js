import User from '../models/User.js';
import DeviceSession from '../models/DeviceSession.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, handle, avatar, bio, phone } = req.body;

    if (!name || !email || !password || !handle) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and handle',
      });
    }

    // Check if user or handle already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const cleanHandle = handle.startsWith('@') ? handle.slice(1).toLowerCase() : handle.toLowerCase();
    const existingHandle = await User.findOne({ handle: cleanHandle });
    if (existingHandle) {
      return res.status(400).json({ success: false, message: 'Username handle is already taken' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      handle: cleanHandle,
      avatar: avatar || `https://i.pravatar.cc/150?u=${cleanHandle}`,
      bio: bio || 'Hey there! I am using Telejog ✈️',
      phone: phone || '',
      isOnline: true,
      lastSeen: 'Online',
    });

    const token = generateToken(user._id);

    // Save session if device info is provided
    if (req.body.deviceName) {
      await DeviceSession.create({
        user: user._id,
        deviceName: req.body.deviceName || 'Mobile Device',
        deviceType: req.body.deviceType || 'mobile',
        platform: req.body.platform || 'Unknown OS',
        appName: req.body.appName || 'Telejog',
        ipAddress: req.ip || '127.0.0.1',
        location: req.body.location || 'Dhaka, Bangladesh',
        lastActive: 'Online · Current Session',
        token,
      });
    }

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        handle: user.handle,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        verified: user.verified,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { emailOrHandle, password } = req.body;

    if (!emailOrHandle || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or username handle, and password',
      });
    }

    const query = emailOrHandle.includes('@')
      ? { email: emailOrHandle.toLowerCase() }
      : { handle: emailOrHandle.replace(/^@/, '').toLowerCase() };

    const user = await User.findOne(query).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Set online
    user.isOnline = true;
    user.lastSeen = 'Online';
    await user.save();

    const token = generateToken(user._id);

    // Save or update device session
    if (req.body.deviceName) {
      await DeviceSession.create({
        user: user._id,
        deviceName: req.body.deviceName,
        deviceType: req.body.deviceType || 'mobile',
        platform: req.body.platform || 'Mobile OS',
        appName: req.body.appName || 'Telejog',
        ipAddress: req.ip || '127.0.0.1',
        location: req.body.location || 'Dhaka, Bangladesh',
        lastActive: 'Online · Current Session',
        token,
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        handle: user.handle,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        verified: user.verified,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, bio, phone, avatar, handle } = req.body;

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;

    if (handle) {
      const cleanHandle = handle.replace(/^@/, '').toLowerCase();
      if (cleanHandle !== user.handle) {
        const handleExists = await User.findOne({ handle: cleanHandle });
        if (handleExists) {
          return res.status(400).json({ success: false, message: 'Username handle is already taken' });
        }
        user.handle = cleanHandle;
      }
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
