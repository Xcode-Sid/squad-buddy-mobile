export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: "squad" | "dm" | "field" | "support" | "admin-broadcast";
  avatar: string;
  participants: { id: string; name: string; avatar: string; role: "individual" | "business" | "admin" }[];
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  sport?: string;
  sportEmoji?: string;
  online?: number;
  description?: string;
}

const AV = (n: number) => `https://i.pravatar.cc/150?img=${n}`;

export const CHAT_ROOMS: ChatRoom[] = [
  {
    id: "room-1",
    name: "Tirana Football Squad",
    type: "squad",
    avatar: AV(60),
    sport: "football",
    sportEmoji: "⚽",
    description: "5v5 weekly games at Arena Sport",
    online: 4,
    participants: [
      { id: "p1", name: "Andi Hoxha", avatar: AV(1), role: "individual" },
      { id: "p2", name: "Erisa Çela", avatar: AV(5), role: "individual" },
      { id: "p3", name: "Blerim Krasniqi", avatar: AV(3), role: "individual" },
      { id: "p4", name: "Sara Basha", avatar: AV(9), role: "individual" },
      { id: "me", name: "You", avatar: AV(12), role: "individual" },
    ],
    lastMessage: "Who's in for Thursday? We need 2 more!",
    lastMessageTime: "2 min ago",
    unread: 3,
  },
  {
    id: "room-2",
    name: "Basketball Nights",
    type: "squad",
    avatar: AV(61),
    sport: "basketball",
    sportEmoji: "🏀",
    description: "3v3 weekend basketball crew",
    online: 2,
    participants: [
      { id: "p5", name: "Dritan Leka", avatar: AV(11), role: "individual" },
      { id: "p6", name: "Klea Mema", avatar: AV(21), role: "individual" },
      { id: "p7", name: "Florian Shehu", avatar: AV(15), role: "individual" },
      { id: "me", name: "You", avatar: AV(12), role: "individual" },
    ],
    lastMessage: "Great game yesterday! Let's do Saturday again?",
    lastMessageTime: "15 min ago",
    unread: 1,
  },
  {
    id: "room-3",
    name: "Padel Beginners",
    type: "squad",
    avatar: AV(62),
    sport: "padel",
    sportEmoji: "🏓",
    description: "Learning padel together in Durrës",
    online: 1,
    participants: [
      { id: "p8", name: "Gentian Xhafa", avatar: AV(18), role: "individual" },
      { id: "p9", name: "Viola Hasa", avatar: AV(34), role: "individual" },
      { id: "me", name: "You", avatar: AV(12), role: "individual" },
    ],
    lastMessage: "Found a coach willing to do group sessions!",
    lastMessageTime: "1h ago",
    unread: 0,
  },
  {
    id: "dm-1",
    name: "Erisa Çela",
    type: "dm",
    avatar: AV(5),
    participants: [
      { id: "p2", name: "Erisa Çela", avatar: AV(5), role: "individual" },
      { id: "me", name: "You", avatar: AV(12), role: "individual" },
    ],
    lastMessage: "See you at the field at 6!",
    lastMessageTime: "30 min ago",
    unread: 1,
  },
  {
    id: "dm-2",
    name: "Blerim Krasniqi",
    type: "dm",
    avatar: AV(3),
    participants: [
      { id: "p3", name: "Blerim Krasniqi", avatar: AV(3), role: "individual" },
      { id: "me", name: "You", avatar: AV(12), role: "individual" },
    ],
    lastMessage: "Bro did you book the field?",
    lastMessageTime: "3h ago",
    unread: 0,
  },
  {
    id: "field-1",
    name: "Arena Sport Tirana",
    type: "field",
    avatar: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=100&h=100&fit=crop",
    sport: "football",
    sportEmoji: "⚽",
    description: "Official chat for Arena Sport customers",
    online: 8,
    participants: [
      { id: "biz-1", name: "Kompleksi Sportiv Tirana", avatar: AV(50), role: "business" },
      { id: "p1", name: "Andi Hoxha", avatar: AV(1), role: "individual" },
      { id: "p2", name: "Erisa Çela", avatar: AV(5), role: "individual" },
      { id: "me", name: "You", avatar: AV(12), role: "individual" },
    ],
    lastMessage: "Field 2 maintenance done, bookings open again!",
    lastMessageTime: "45 min ago",
    unread: 2,
  },
  {
    id: "field-2",
    name: "Tennis Club Durrës",
    type: "field",
    avatar: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=100&h=100&fit=crop",
    sport: "tennis",
    sportEmoji: "🎾",
    description: "Chat with Tennis Club Durrës",
    online: 3,
    participants: [
      { id: "biz-2", name: "Tennis Club Durrës", avatar: AV(51), role: "business" },
      { id: "p8", name: "Gentian Xhafa", avatar: AV(18), role: "individual" },
      { id: "me", name: "You", avatar: AV(12), role: "individual" },
    ],
    lastMessage: "New group lesson schedule posted!",
    lastMessageTime: "2h ago",
    unread: 0,
  },
  {
    id: "support-1",
    name: "Squad Buddy Support",
    type: "support",
    avatar: "",
    description: "Get help from the admin team",
    participants: [
      { id: "admin-1", name: "Admin", avatar: "", role: "admin" },
      { id: "me", name: "You", avatar: AV(12), role: "individual" },
    ],
    lastMessage: "How can we help you today?",
    lastMessageTime: "1d ago",
    unread: 0,
  },
  {
    id: "admin-biz-1",
    name: "Kompleksi Sportiv Tirana",
    type: "support",
    avatar: AV(50),
    description: "Business support channel",
    participants: [
      { id: "admin-1", name: "Admin", avatar: "", role: "admin" },
      { id: "biz-1", name: "Kompleksi Sportiv Tirana", avatar: AV(50), role: "business" },
    ],
    lastMessage: "Your verification is approved!",
    lastMessageTime: "2d ago",
    unread: 0,
  },
  {
    id: "admin-biz-2",
    name: "Tennis Club Durrës",
    type: "support",
    avatar: AV(51),
    description: "Business support channel",
    participants: [
      { id: "admin-1", name: "Admin", avatar: "", role: "admin" },
      { id: "biz-2", name: "Tennis Club Durrës", avatar: AV(51), role: "business" },
    ],
    lastMessage: "When will my payout be processed?",
    lastMessageTime: "5h ago",
    unread: 1,
  },
  {
    id: "admin-broadcast",
    name: "Platform Announcements",
    type: "admin-broadcast",
    avatar: "",
    description: "Official announcements from Squad Buddy",
    online: 42,
    participants: [],
    lastMessage: "New feature: Live streaming is now available for all businesses!",
    lastMessageTime: "1d ago",
    unread: 0,
  },
];

export const CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  "room-1": [
    { id: "m1", senderId: "p1", senderName: "Andi Hoxha", senderAvatar: AV(1), text: "Thursday game still on?", timestamp: "5:30 PM" },
    { id: "m2", senderId: "p2", senderName: "Erisa Çela", senderAvatar: AV(5), text: "Yes! I'm coming for sure 💪", timestamp: "5:32 PM" },
    { id: "m3", senderId: "me", senderName: "You", senderAvatar: AV(12), text: "Count me in! Same time as last week?", timestamp: "5:35 PM", isMe: true },
    { id: "m4", senderId: "p3", senderName: "Blerim Krasniqi", senderAvatar: AV(3), text: "6 PM works for me", timestamp: "5:38 PM" },
    { id: "m5", senderId: "p1", senderName: "Andi Hoxha", senderAvatar: AV(1), text: "Perfect, 6 PM at Arena Sport. We need 2 more for 5v5", timestamp: "5:40 PM" },
    { id: "m6", senderId: "p4", senderName: "Sara Basha", senderAvatar: AV(9), text: "I can bring my cousin, so that's one more!", timestamp: "5:42 PM" },
    { id: "m7", senderId: "p1", senderName: "Andi Hoxha", senderAvatar: AV(1), text: "Who's in for Thursday? We need 2 more!", timestamp: "5:45 PM" },
  ],
  "room-2": [
    { id: "m1", senderId: "p5", senderName: "Dritan Leka", senderAvatar: AV(11), text: "That last play was insane 😂", timestamp: "Yesterday" },
    { id: "m2", senderId: "me", senderName: "You", senderAvatar: AV(12), text: "Haha thanks! Lucky shot honestly", timestamp: "Yesterday", isMe: true },
    { id: "m3", senderId: "p6", senderName: "Klea Mema", senderAvatar: AV(21), text: "Saturday same time?", timestamp: "Today 10:00 AM" },
    { id: "m4", senderId: "p5", senderName: "Dritan Leka", senderAvatar: AV(11), text: "Great game yesterday! Let's do Saturday again?", timestamp: "Today 10:15 AM" },
  ],
  "dm-1": [
    { id: "m1", senderId: "me", senderName: "You", senderAvatar: AV(12), text: "Hey, are we still on for today?", timestamp: "4:00 PM", isMe: true },
    { id: "m2", senderId: "p2", senderName: "Erisa Çela", senderAvatar: AV(5), text: "Yes! I'll be there. Which field?", timestamp: "4:05 PM" },
    { id: "m3", senderId: "me", senderName: "You", senderAvatar: AV(12), text: "Arena Sport, field 2", timestamp: "4:07 PM", isMe: true },
    { id: "m4", senderId: "p2", senderName: "Erisa Çela", senderAvatar: AV(5), text: "See you at the field at 6!", timestamp: "4:10 PM" },
  ],
  "field-1": [
    { id: "m1", senderId: "biz-1", senderName: "Kompleksi Sportiv Tirana", senderAvatar: AV(50), text: "📢 Announcement: Field 2 will be under maintenance tomorrow from 8-12 AM", timestamp: "Yesterday" },
    { id: "m2", senderId: "p1", senderName: "Andi Hoxha", senderAvatar: AV(1), text: "Thanks for the heads up! Will my 10 AM booking be moved?", timestamp: "Yesterday" },
    { id: "m3", senderId: "biz-1", senderName: "Kompleksi Sportiv Tirana", senderAvatar: AV(50), text: "Yes, we'll move you to Field 3 at the same time. No extra charge 👍", timestamp: "Yesterday" },
    { id: "m4", senderId: "biz-1", senderName: "Kompleksi Sportiv Tirana", senderAvatar: AV(50), text: "Field 2 maintenance done, bookings open again!", timestamp: "Today" },
  ],
  "support-1": [
    { id: "m1", senderId: "admin-1", senderName: "Squad Buddy Support", senderAvatar: "", text: "Welcome to Squad Buddy Support! How can we help you today?", timestamp: "Yesterday" },
    { id: "m2", senderId: "me", senderName: "You", senderAvatar: AV(12), text: "Hi, I had an issue with my last booking refund", timestamp: "Yesterday", isMe: true },
    { id: "m3", senderId: "admin-1", senderName: "Squad Buddy Support", senderAvatar: "", text: "I can see your refund request for booking #4523. It's been processed and should appear in your account within 2-3 business days.", timestamp: "Yesterday" },
  ],
  "admin-biz-1": [
    { id: "m1", senderId: "biz-1", senderName: "Kompleksi Sportiv Tirana", senderAvatar: AV(50), text: "Hi, we applied for verification last week. Any update?", timestamp: "3d ago" },
    { id: "m2", senderId: "admin-1", senderName: "Admin", senderAvatar: "", text: "Hi! I've reviewed your documents. Everything looks good. Your verification is approved!", timestamp: "2d ago" },
    { id: "m3", senderId: "biz-1", senderName: "Kompleksi Sportiv Tirana", senderAvatar: AV(50), text: "Thank you so much! 🎉", timestamp: "2d ago" },
  ],
  "admin-biz-2": [
    { id: "m1", senderId: "biz-2", senderName: "Tennis Club Durrës", senderAvatar: AV(51), text: "When will my payout be processed?", timestamp: "5h ago" },
  ],
  "admin-broadcast": [
    { id: "m1", senderId: "admin-1", senderName: "Squad Buddy", senderAvatar: "", text: "🎉 Welcome to Squad Buddy! We're thrilled to have you.", timestamp: "1 week ago" },
    { id: "m2", senderId: "admin-1", senderName: "Squad Buddy", senderAvatar: "", text: "📡 New feature: Live streaming is now available for all businesses!", timestamp: "1d ago" },
  ],
};
