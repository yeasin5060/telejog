# Telejog Backend API Server 🚀

Node.js, Express, MongoDB (Mongoose), Socket.IO, and JWT-powered backend API for the **Telejog Messenger App**.

---

## 📁 Project Architecture & Folder Structure

```
server/
├── .env                  # Environment configuration
├── .env.example          # Example environment configuration
├── .gitignore            # Git ignore file
├── package.json          # Dependencies and scripts
├── README.md             # Complete documentation
├── uploads/              # Local uploaded files storage
└── src/
    ├── app.js            # Express app configuration & middleware pipeline
    ├── server.js         # HTTP Server & Socket.IO server initialization
    ├── config/
    │   └── db.js         # MongoDB connection using Mongoose
    ├── models/
    │   ├── User.js          # User schema & password hashing
    │   ├── Conversation.js  # Chats, groups, channels, bots
    │   ├── Message.js       # Messages, media, voice, replies & reactions
    │   ├── Story.js         # 24-hr status stories with viewers
    │   └── DeviceSession.js # Active device sessions & login locations
    ├── controllers/
    │   ├── authController.js         # Register, Login, Me, Profile update
    │   ├── userController.js         # Search users, Contacts list, Status
    │   ├── conversationController.js # Direct chat, groups, channels, pin, mute
    │   ├── messageController.js      # Send, retrieve, react, pin, delete, read
    │   ├── storyController.js        # Stories feed (UserStory), create, view
    │   └── deviceController.js       # Device management & session termination
    ├── routes/
    │   ├── authRoutes.js         # /api/auth/*
    │   ├── userRoutes.js         # /api/users/*
    │   ├── conversationRoutes.js # /api/conversations/*
    │   ├── messageRoutes.js      # /api/messages/*
    │   ├── storyRoutes.js        # /api/stories/*
    │   ├── deviceRoutes.js       # /api/devices/*
    │   └── uploadRoutes.js       # /api/upload (Media file uploads)
    ├── middleware/
    │   ├── authMiddleware.js     # JWT Protect middleware
    │   └── errorMiddleware.js    # 404 and global error handler
    ├── socket/
    │   └── socketHandler.js      # Socket.IO real-time events & typing indicator
    └── utils/
        ├── generateToken.js      # JWT token generator
        └── seedData.js           # Database seeder with Telejog dummy data
```

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment (`.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/telejog
JWT_SECRET=telejog_super_secret_jwt_key_2026_xyz123
JWT_EXPIRES_IN=30d
CLIENT_URL=*
```

### 3. Seed Database (Optional)
Populate initial demo users, chats, stories, and device sessions:
```bash
npm run seed
```

> **Default Seed Credentials:**
> - Email: `user@telejog.app` OR Handle: `telejog_official`
> - Password: `password123`

### 4. Run Server
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login with email/handle & password | Public |
| `GET` | `/api/auth/me` | Get current authenticated user | Private |
| `PUT` | `/api/auth/profile` | Update profile (name, bio, phone, avatar, handle) | Private |

### 👥 Users & Contacts (`/api/users`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/users/search?q=query` | Search users by name, handle, phone | Private |
| `GET` | `/api/users` | Get all contacts/users | Private |
| `GET` | `/api/users/:id` | Get specific user by ID | Private |
| `PUT` | `/api/users/status` | Update online status & last seen | Private |

### 💬 Conversations (`/api/conversations`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/conversations` | Get all user chats/channels/groups (sorted, pinned first) | Private |
| `GET` | `/api/conversations/:id` | Get conversation details | Private |
| `POST` | `/api/conversations/direct` | Get or create 1-on-1 chat (`{ recipientId }`) | Private |
| `POST` | `/api/conversations/group` | Create group or channel (`{ title, type, participantIds }`) | Private |
| `PUT` | `/api/conversations/:id/pin` | Toggle pin conversation | Private |
| `PUT` | `/api/conversations/:id/mute` | Toggle mute conversation | Private |

### ✉️ Messages (`/api/messages`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/messages/:conversationId` | Get messages for conversation | Private |
| `POST` | `/api/messages` | Send message (text, media, voice, replyTo) | Private |
| `POST` | `/api/messages/:id/react` | Add/remove emoji reaction | Private |
| `PUT` | `/api/messages/:id/pin` | Pin/unpin message | Private |
| `DELETE` | `/api/messages/:id` | Delete message | Private |
| `PUT` | `/api/messages/read/:conversationId`| Mark all messages as read | Private |

### 📸 Stories (`/api/stories`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/stories` | Get active stories feed (grouped by User) | Private |
| `POST` | `/api/stories` | Post a new story | Private |
| `PUT` | `/api/stories/:id/view` | Mark story as seen/viewed | Private |
| `DELETE` | `/api/stories/:id` | Delete user story | Private |

### 📱 Devices & Sessions (`/api/devices`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/devices` | Get all logged-in devices | Private |
| `DELETE` | `/api/devices/:id` | Terminate a device session | Private |
| `DELETE` | `/api/devices/other/all` | Terminate all other sessions | Private |

### 📁 Media Upload (`/api/upload`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/upload` | Upload image, audio, video or doc (`file`) | Private |

---

## ⚡ Real-Time Socket.IO Events

| Event Name | Direction | Payload / Description |
|---|---|---|
| `setup` | Client ➔ Server | Send `{ _id, name }` to register socket with user ID |
| `join_conversation` | Client ➔ Server | Join room `conv_<conversationId>` |
| `leave_conversation` | Client ➔ Server | Leave room `conv_<conversationId>` |
| `send_message` | Client ➔ Server | Broadcast new message to conversation room |
| `new_message` | Server ➔ Client | Incoming real-time message |
| `typing_start` | Client ➔ Server | Start typing indicator in conversation |
| `typing_stop` | Client ➔ Server | Stop typing indicator in conversation |
| `user_typing` | Server ➔ Client | `{ conversationId, userId, isTyping }` |
| `user_status_changed` | Server ➔ Client | `{ userId, isOnline, lastSeen }` broadcast |
| `reaction_updated` | Server ➔ Client | Real-time emoji reaction updates |
