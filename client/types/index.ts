export interface User {
    _id: string;
    name: string;
    email?: string;
    handle: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    isOnline: boolean;
    lastSeen: string;
    verified?: boolean;
}

export interface DeviceSession {
    id: string;
    deviceName: string;
    deviceType: "mobile" | "desktop" | "tablet" | "browser";
    platform: string;
    appName: string;
    ipAddress: string;
    location: string;
    lastActive: string;
    isCurrent: boolean;
}

export interface Message {
    _id: string;
    sender: string;
    receiver?: string;
    text?: string;
    mediaUrl?: string;
    mediaType?: "image" | "video" | "audio" | "document" | "voice";
    voiceDuration?: string;
    read: boolean;
    pinned?: boolean;
    createdAt: string;
    conversationId: string;
    reactions?: { emoji: string; count: number; userReacted?: boolean }[];
    replyTo?: { _id: string; text: string; senderName: string };
}

export interface Conversation {
    _id: string;
    participant?: User; // For 1-on-1 chats
    title?: string; // For groups / channels
    type?: "user" | "group" | "channel" | "bot";
    avatar?: string;
    lastMessage?: Message;
    unreadCount?: number;
    isPinned?: boolean;
    isMuted?: boolean;
    isOnline?: boolean;
    membersCount?: number;
    updatedAt: string;
}

export interface Story {
    _id: string;
    user: User;
    mediaUrl: string;
    mediaType: "image" | "video";
    caption?: string;
    createdAt: string;
}

export interface UserStory {
    user: User;
    hasUnseen?: boolean;
    stories: Story[];
}

export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
}

export interface WsEvent {
    type: string;
    payload?: any;
    senderId?: string;
    isTyping?: boolean;
    userId?: string;
    isOnline?: boolean;
    user?: User;
    conversationId?: string;
    [key: string]: any;
}

