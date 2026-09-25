import { useEffect, useRef } from 'react'
import {
  ArrowLeft,
  Info,
  LockKeyhole,
  MoreHorizontal,
  Phone,
  Video,
} from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Composer } from './Composer'
import { MessageBubble } from './MessageBubble'
import type {
  Conversation,
  Message,
  NewMessage,
  User,
} from '../../types/messaging'

interface ChatPanelProps {
  conversation?: Conversation
  users: User[]
  currentUser: User
  replyingTo: Message | null
  onReply: (message: Message) => void
  onCancelReply: () => void
  onSend: (message: NewMessage) => void
  onFileSelected: (file: File) => void
  onOpenProfile: (userId: string) => void
  onBack: () => void
  draft: string
  onDraftChange: (value: string) => void
}

export function ChatPanel({
  conversation,
  users,
  currentUser,
  replyingTo,
  onReply,
  onCancelReply,
  onSend,
  onFileSelected,
  onOpenProfile,
  onBack,
  draft,
  onDraftChange,
}: ChatPanelProps) {
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [conversation?.id, conversation?.messages.length])

  if (!conversation) {
    return (
      <section className="chat-pane chat-pane-empty" aria-label="No conversation selected">
        <div className="chat-empty-state">
          <span className="chat-empty-illustration">
            <span className="empty-illustration-dot empty-illustration-dot-one" />
            <span className="empty-illustration-dot empty-illustration-dot-two" />
            <span className="empty-illustration-bubble">
              <Info size={22} strokeWidth={1.7} />
            </span>
          </span>
          <h2>Select a conversation</h2>
          <p>Choose a chat from the left or start a new conversation with a contact.</p>
        </div>
      </section>
    )
  }

  const userMap = new Map(users.map((user) => [user.id, user]))
  const otherUser = conversation.participantIds
    .filter((id) => id !== currentUser.id)
    .map((id) => userMap.get(id))
    .find(Boolean)
  const replyingSender = replyingTo
    ? userMap.get(replyingTo.senderId)
    : undefined
  const presenceLabel =
    conversation.type === 'group'
      ? `${conversation.participantIds.length} members`
      : conversation.presence === 'online'
        ? 'Active now'
        : conversation.presence === 'away'
          ? 'Away for a moment'
          : 'Last seen recently'

  return (
    <section className="chat-pane" aria-label={`Conversation with ${conversation.name}`}>
      <header className="chat-header">
        <button
          className="icon-button subtle mobile-back-button"
          type="button"
          onClick={onBack}
          aria-label="Back to conversations"
        >
          <ArrowLeft size={19} strokeWidth={1.8} />
        </button>
        <button
          className="chat-person-button"
          type="button"
          onClick={() => onOpenProfile(otherUser?.id ?? currentUser.id)}
        >
          <Avatar
            user={conversation.type === 'direct' ? otherUser : conversation}
            size="md"
            showPresence={conversation.type === 'direct'}
          />
          <span className="chat-person-copy">
            <strong>{conversation.name}</strong>
            <small>{presenceLabel}</small>
          </span>
        </button>
        <div className="chat-header-actions">
          <button className="icon-button subtle" type="button" aria-label="Start voice call">
            <Phone size={18} strokeWidth={1.8} />
          </button>
          <button className="icon-button subtle" type="button" aria-label="Start video call">
            <Video size={18} strokeWidth={1.8} />
          </button>
          <button className="icon-button subtle" type="button" aria-label="More conversation options">
            <MoreHorizontal size={19} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <div className="chat-notice">
        <span className="chat-notice-icon">
          <LockKeyhole size={13} strokeWidth={1.8} />
        </span>
        <span>
          {conversation.type === 'group'
            ? 'This is a shared space. Keep the conversation kind and useful.'
            : 'This is a private preview conversation — no messages leave this device.'}
        </span>
      </div>

      <div className="chat-thread" ref={threadRef}>
        <div className="thread-date-divider">
          <span>Today</span>
        </div>
        {conversation.messages.length > 0 ? (
          conversation.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              sender={userMap.get(message.senderId)}
              isOwn={message.senderId === currentUser.id}
              isGroup={conversation.type === 'group'}
              quotedMessage={
                message.replyToId
                  ? conversation.messages.find((item) => item.id === message.replyToId)
                  : undefined
              }
              onReply={onReply}
            />
          ))
        ) : (
          <div className="thread-empty-state">
            <span className="thread-empty-icon">
              <MessageBubbleIcon />
            </span>
            <strong>Start the conversation</strong>
            <span>Send a message to {conversation.name}.</span>
          </div>
        )}
      </div>

      <Composer
        draft={draft}
        onDraftChange={onDraftChange}
        replyingTo={replyingTo}
        replyingSender={replyingSender}
        onCancelReply={onCancelReply}
        onSend={onSend}
        onFileSelected={onFileSelected}
      />
    </section>
  )
}

function MessageBubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="message-bubble-svg">
      <path d="M7.2 18.2 3.8 20l.9-3.7A7.5 7.5 0 1 1 7.2 18.2Z" />
      <path d="M8 11.8h.01M12 11.8h.01M16 11.8h.01" />
    </svg>
  )
}
