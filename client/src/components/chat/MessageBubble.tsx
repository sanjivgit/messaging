import {
  CheckCheck,
  Download,
  FileText,
  Image as ImageIcon,
  Play,
  Reply,
  Video,
} from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import type { Message, User } from '../../types/messaging'

interface MessageBubbleProps {
  message: Message
  sender?: User
  isOwn: boolean
  isGroup: boolean
  quotedMessage?: Message
  onReply: (message: Message) => void
}

function AttachmentCard({ message }: { message: Message }) {
  if (message.type === 'image') {
    return (
      <div className="message-attachment image-attachment">
        {message.previewUrl ? (
          <img src={message.previewUrl} alt={message.body} />
        ) : (
          <div className="image-placeholder">
            <span className="image-placeholder-orb image-placeholder-orb-one" />
            <span className="image-placeholder-orb image-placeholder-orb-two" />
            <span className="attachment-icon-bubble">
              <ImageIcon size={19} strokeWidth={1.7} />
            </span>
          </div>
        )}
        <span className="attachment-caption">
          <ImageIcon size={13} strokeWidth={1.8} />
          {message.body}
        </span>
      </div>
    )
  }

  if (message.type === 'video') {
    return (
      <div className="message-attachment video-attachment">
        <div className="video-placeholder">
          <span className="video-placeholder-glow" />
          <span className="play-button">
            <Play size={17} fill="currentColor" strokeWidth={1.7} />
          </span>
          <span className="video-duration">00:42</span>
        </div>
        <span className="attachment-caption">
          <Video size={13} strokeWidth={1.8} />
          {message.body || 'Video attachment'}
        </span>
      </div>
    )
  }

  if (message.type === 'document') {
    return (
      <div className="message-attachment document-attachment">
        <span className="file-icon">
          <FileText size={19} strokeWidth={1.7} />
        </span>
        <span className="file-details">
          <strong>{message.fileName ?? message.body}</strong>
          <small>{message.fileSize ?? 'Document attachment'}</small>
        </span>
        <button className="attachment-action" type="button" aria-label="Download document">
          <Download size={15} strokeWidth={1.8} />
        </button>
      </div>
    )
  }

  return (
    <div className="message-attachment audio-attachment">
      <button className="audio-play" type="button" aria-label="Play audio message">
        <Play size={14} fill="currentColor" strokeWidth={1.7} />
      </button>
      <span className="audio-waveform" aria-hidden="true">
        {[12, 20, 9, 25, 15, 29, 12, 22, 10, 18, 27, 14, 21, 9, 17, 24, 12, 19].map(
          (height, index) => (
            <i key={`${height}-${index}`} style={{ height }} />
          ),
        )}
      </span>
      <span className="audio-duration">{message.duration ?? '0:00'}</span>
    </div>
  )
}

export function MessageBubble({
  message,
  sender,
  isOwn,
  isGroup,
  quotedMessage,
  onReply,
}: MessageBubbleProps) {
  const showSender = isGroup && !isOwn && sender

  return (
    <div className={`message-row ${isOwn ? 'message-row-own' : ''}`.trim()}>
      {!isOwn ? <Avatar user={sender} size="xs" /> : null}
      <div className="message-stack">
        {showSender ? <span className="message-sender-name">{sender.name}</span> : null}
        <div className={`message-bubble ${isOwn ? 'message-bubble-own' : ''}`.trim()}>
          {message.type === 'reply' && quotedMessage ? (
            <div className="reply-quote">
              <span className="reply-quote-bar" />
              <span>
                <strong>{quotedMessage.body}</strong>
                <small>Replying to a message</small>
              </span>
            </div>
          ) : null}

          {message.type === 'image' ||
          message.type === 'video' ||
          message.type === 'document' ||
          message.type === 'audio' ? (
            <AttachmentCard message={message} />
          ) : (
            <p className="message-text">{message.body}</p>
          )}

          <div className="message-meta">
            <span>{message.time}</span>
            {isOwn ? (
              <CheckCheck
                className={message.isRead ? 'is-read' : ''}
                size={13}
                strokeWidth={1.8}
              />
            ) : null}
          </div>
        </div>
        <button
          className="message-reply-button"
          type="button"
          onClick={() => onReply(message)}
          aria-label="Reply to message"
          title="Reply"
        >
          <Reply size={13} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}
