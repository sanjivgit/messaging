export type Presence = 'online' | 'away' | 'offline'

export type ConversationType = 'direct' | 'group'

export type MessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'document'
  | 'audio'
  | 'reply'

export type AppView = 'chats' | 'contacts' | 'groups' | 'profile'

export type ConversationFilter = 'all' | 'unread' | 'groups'

export interface User {
  id: string
  name: string
  phone: string
  initials: string
  avatarColor: string
  presence: Presence
  bio?: string
}

export interface Message {
  id: string
  senderId: string
  type: MessageType
  body: string
  time: string
  replyToId?: string
  fileName?: string
  fileSize?: string
  duration?: string
  previewUrl?: string
  isRead?: boolean
}

export interface Conversation {
  id: string
  type: ConversationType
  name: string
  initials: string
  avatarColor: string
  participantIds: string[]
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  presence?: Presence
  pinned?: boolean
  description?: string
  messages: Message[]
}

export interface NewMessage {
  type: MessageType
  body: string
  replyToId?: string
  fileName?: string
  fileSize?: string
  duration?: string
  previewUrl?: string
}

export interface ProfileDraft {
  name: string
  bio: string
  presence: Presence
}
