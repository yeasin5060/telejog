import mongoose from 'mongoose';

const deviceSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      enum: ['mobile', 'desktop', 'tablet', 'browser'],
      default: 'mobile',
    },
    platform: {
      type: String,
      default: 'Unknown',
    },
    appName: {
      type: String,
      default: 'Telejog App',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    location: {
      type: String,
      default: 'Dhaka, Bangladesh',
    },
    lastActive: {
      type: String,
      default: 'Just now',
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const DeviceSession = mongoose.model('DeviceSession', deviceSessionSchema);
export default DeviceSession;
