import DeviceSession from '../models/DeviceSession.js';

// @desc    Get all active device sessions for current user
// @route   GET /api/devices
// @access  Private
export const getDeviceSessions = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const currentToken = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : null;

    let sessions = await DeviceSession.find({ user: currentUserId }).sort({
      createdAt: -1,
    });

    // If no session exists yet, create one for current request
    if (sessions.length === 0) {
      const userAgent = req.headers['user-agent'] || 'Unknown Device';
      const defaultSession = await DeviceSession.create({
        user: currentUserId,
        deviceName: 'Current Device',
        deviceType: userAgent.includes('Mobile') ? 'mobile' : 'desktop',
        platform: 'Android / iOS / Web',
        appName: 'Telejog App v3.2.0',
        ipAddress: req.ip || '127.0.0.1',
        location: 'Dhaka, Bangladesh',
        lastActive: 'Online · Current Session',
        token: currentToken,
      });
      sessions = [defaultSession];
    }

    const formattedSessions = sessions.map((s, index) => {
      const isCurrent = currentToken && s.token === currentToken ? true : index === 0;

      return {
        id: s._id.toString(),
        deviceName: s.deviceName,
        deviceType: s.deviceType,
        platform: s.platform,
        appName: s.appName,
        ipAddress: s.ipAddress,
        location: s.location,
        lastActive: isCurrent ? 'Online · Current Session' : s.lastActive,
        isCurrent,
      };
    });

    res.json({
      success: true,
      count: formattedSessions.length,
      sessions: formattedSessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Terminate a specific device session
// @route   DELETE /api/devices/:id
// @access  Private
export const terminateSession = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const session = await DeviceSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.user.toString() !== currentUserId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to terminate this session' });
    }

    await DeviceSession.deleteOne({ _id: session._id });

    res.json({
      success: true,
      message: 'Session terminated successfully',
      terminatedId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Terminate all other sessions
// @route   DELETE /api/devices/other/all
// @access  Private
export const terminateAllOtherSessions = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const currentToken = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : null;

    if (currentToken) {
      await DeviceSession.deleteMany({
        user: currentUserId,
        token: { $ne: currentToken },
      });
    } else {
      // Keep only the most recent session
      const latestSession = await DeviceSession.findOne({ user: currentUserId }).sort({
        createdAt: -1,
      });
      if (latestSession) {
        await DeviceSession.deleteMany({
          user: currentUserId,
          _id: { $ne: latestSession._id },
        });
      }
    }

    res.json({
      success: true,
      message: 'All other sessions have been terminated',
    });
  } catch (error) {
    next(error);
  }
};
