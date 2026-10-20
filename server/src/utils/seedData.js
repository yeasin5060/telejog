import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Story from '../models/Story.js';
import DeviceSession from '../models/DeviceSession.js';

dotenv.config();

const usersData = [
  {
    name: 'Telejog User',
    email: 'user@telejog.app',
    password: 'password123',
    handle: 'telejog_official',
    avatar: 'https://i.pravatar.cc/150?img=68',
    bio: 'Hey there! I am using Telejog ✈️',
    phone: '+880 1700-000000',
    isOnline: true,
    lastSeen: 'Online',
    verified: true,
  },
  {
    name: 'Ethan Parker',
    email: 'ethan.parker@example.com',
    password: 'password123',
    handle: 'ethanparker',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Hey there! I am using Telejog.',
    phone: '+880 1800-111111',
    isOnline: true,
    lastSeen: 'Online',
    verified: true,
  },
  {
    name: 'Olivia Bennett',
    email: 'olivia.bennett@example.com',
    password: 'password123',
    handle: 'oliviabennett',
    avatar: 'https://i.pravatar.cc/150?img=13',
    bio: 'Design enthusiast & traveler ✨',
    phone: '+880 1900-222222',
    isOnline: true,
    lastSeen: 'Online',
    verified: false,
  },
  {
    name: 'Liam Carter',
    email: 'liam.carter@example.com',
    password: 'password123',
    handle: 'liamcarter',
    avatar: 'https://i.pravatar.cc/150?img=14',
    bio: 'Fullstack developer & gamer 🎮',
    phone: '+880 1600-333333',
    isOnline: false,
    lastSeen: '15m ago',
    verified: false,
  },
  {
    name: 'Sophia Reed',
    email: 'sophia.reed@example.com',
    password: 'password123',
    handle: 'sophiareed',
    avatar: 'https://i.pravatar.cc/150?img=15',
    bio: 'Coffee lover & photographer 📸',
    phone: '+880 1500-444444',
    isOnline: true,
    lastSeen: 'Online',
    verified: false,
  },
  {
    name: 'Noah Mitchell',
    email: 'noah.mitchell@example.com',
    password: 'password123',
    handle: 'noahmitchell',
    avatar: 'https://i.pravatar.cc/150?img=16',
    bio: 'Music producer & tech geek 🎧',
    phone: '+880 1300-555555',
    isOnline: false,
    lastSeen: 'Yesterday',
    verified: false,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/telejog';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB: ${mongoUri}`);

    // Clear existing data
    await User.deleteMany();
    await Conversation.deleteMany();
    await Message.deleteMany();
    await Story.deleteMany();
    await DeviceSession.deleteMany();
    console.log(' Cleared old data');

    // Create Users (will trigger pre-save bcrypt hash)
    const createdUsers = [];
    for (const u of usersData) {
      const created = await User.create(u);
      createdUsers.push(created);
    }
    console.log(` Inserted ${createdUsers.length} users`);

    const mainUser = createdUsers[0];
    const ethan = createdUsers[1];
    const olivia = createdUsers[2];
    const liam = createdUsers[3];
    const sophia = createdUsers[4];

    // 1. Direct Chat with Ethan
    const convEthan = await Conversation.create({
      type: 'user',
      participants: [mainUser._id, ethan._id],
      pinnedBy: [mainUser._id],
      membersCount: 2,
    });

    const msgEthan1 = await Message.create({
      conversationId: convEthan._id,
      sender: ethan._id,
      receiver: mainUser._id,
      text: "Hey! Did you check the new Telejog UI?",
      read: true,
      createdAt: new Date(Date.now() - 3600000),
    });

    const msgEthan2 = await Message.create({
      conversationId: convEthan._id,
      sender: ethan._id,
      receiver: mainUser._id,
      text: "Here's the latest UI mockup. Let me know what you think!",
      read: false,
      createdAt: new Date(Date.now() - 1800000),
    });

    convEthan.lastMessage = msgEthan2._id;
    await convEthan.save();

    // 2. Direct Chat with Olivia
    const convOlivia = await Conversation.create({
      type: 'user',
      participants: [mainUser._id, olivia._id],
      membersCount: 2,
    });

    const msgOlivia = await Message.create({
      conversationId: convOlivia._id,
      sender: olivia._id,
      receiver: mainUser._id,
      text: "Let's catch up tomorrow over coffee! ☕",
      read: true,
      createdAt: new Date(Date.now() - 5400000),
    });

    convOlivia.lastMessage = msgOlivia._id;
    await convOlivia.save();

    // 3. Telejog Developers Group
    const convDevs = await Conversation.create({
      type: 'group',
      title: 'Telejog Developers 💻',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200',
      participants: [mainUser._id, ethan._id, olivia._id, liam._id, sophia._id],
      admin: mainUser._id,
      pinnedBy: [mainUser._id],
      membersCount: 342,
    });

    const msgDev = await Message.create({
      conversationId: convDevs._id,
      sender: ethan._id,
      text: "We just merged the new React Native web optimization branch!",
      read: false,
      createdAt: new Date(Date.now() - 900000),
    });

    convDevs.lastMessage = msgDev._id;
    await convDevs.save();

    // 4. Telejog Official News Channel
    const convNews = await Conversation.create({
      type: 'channel',
      title: 'Telejog Official News 📢',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
      participants: [mainUser._id, ethan._id, olivia._id, liam._id],
      admin: mainUser._id,
      pinnedBy: [mainUser._id],
      membersCount: 124500,
    });

    const msgNews = await Message.create({
      conversationId: convNews._id,
      sender: mainUser._id,
      text: "🚀 Telejog v3.0 Update is Live! Experience ultra-fast messaging & stories.",
      read: false,
      createdAt: new Date(Date.now() - 600000),
    });

    convNews.lastMessage = msgNews._id;
    await convNews.save();

    console.log(' Inserted Conversations & Messages');

    // Create Stories
    await Story.create([
      {
        user: ethan._id,
        mediaUrl: 'https://picsum.photos/id/1011/800/1200',
        mediaType: 'image',
        caption: 'Morning coffee & coding! ☕✨',
      },
      {
        user: olivia._id,
        mediaUrl: 'https://picsum.photos/id/1025/800/1200',
        mediaType: 'image',
        caption: 'Sunset at the beach 🌊🌅',
      },
      {
        user: liam._id,
        mediaUrl: 'https://picsum.photos/id/1043/800/1200',
        mediaType: 'image',
        caption: 'New tech gear setup 🎧💻',
      },
      {
        user: sophia._id,
        mediaUrl: 'https://picsum.photos/id/1050/800/1200',
        mediaType: 'image',
        caption: 'Weekend trip in the mountains 🏔️',
      },
    ]);
    console.log(' Inserted Stories');

    // Create Device Sessions for Main User
    await DeviceSession.create([
      {
        user: mainUser._id,
        deviceName: 'Samsung Galaxy S24 Ultra',
        deviceType: 'mobile',
        platform: 'Android 14 (One UI 6.1)',
        appName: 'Telejog for Android v3.2.0',
        ipAddress: '103.147.218.42',
        location: 'Dhaka, Bangladesh',
        lastActive: 'Online · Current Session',
      },
      {
        user: mainUser._id,
        deviceName: 'MacBook Pro 16"',
        deviceType: 'desktop',
        platform: 'macOS Sonoma 14.5',
        appName: 'Telejog Desktop 4.14.0',
        ipAddress: '103.147.218.42',
        location: 'Dhaka, Bangladesh',
        lastActive: 'Active 14 minutes ago',
      },
      {
        user: mainUser._id,
        deviceName: 'Chrome on Windows 11',
        deviceType: 'browser',
        platform: 'Windows 11 Pro',
        appName: 'Telejog Web Client',
        ipAddress: '119.30.38.102',
        location: 'Chittagong, Bangladesh',
        lastActive: 'Active yesterday at 21:40',
      },
      {
        user: mainUser._id,
        deviceName: 'iPad Pro 11" (4th Gen)',
        deviceType: 'tablet',
        platform: 'iPadOS 17.5.1',
        appName: 'Telejog for iPad',
        ipAddress: '103.147.218.42',
        location: 'Dhaka, Bangladesh',
        lastActive: 'Active 3 days ago',
      },
    ]);
    console.log(' Inserted Device Sessions');

    console.log('\n Seed completed successfully!');
    console.log(' Default Login Credentials:');
    console.log(' Email: user@telejog.app  OR  Handle: telejog_official');
    console.log(' Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error(' Error during seeding:', error);
    process.exit(1);
  }
};

seedDB();
