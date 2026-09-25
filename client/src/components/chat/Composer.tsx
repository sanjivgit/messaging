import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import {
  FileText,
  Image as ImageIcon,
  Mic2,
  Paperclip,
  Reply,
  Send,
  Smile,
  Video,
  X,
} from 'lucide-react'
import type { Message, NewMessage, User } from '../../types/messaging'

interface ComposerProps {
  draft: string
  onDraftChange: (value: string) => void
  replyingTo: Message | null
  replyingSender?: User
  onCancelReply: () => void
  onSend: (message: NewMessage) => void
  onFileSelected: (file: File) => void
}

const emojiOptions = ['😊', '😂', '✨', '👍', '🎉', '❤️']

export function Composer({
  draft,
  onDraftChange,
  replyingTo,
  replyingSender,
  onCancelReply,
  onSend,
  onFileSelected,
}: ComposerProps) {
  const [showAttachments, setShowAttachments] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [fileAccept, setFileAccept] = useState('image/*,video/*,.pdf,.doc,.docx,.txt,audio/*')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openFilePicker = (accept: string) => {
    setFileAccept(accept)
    setShowAttachments(false)
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) onFileSelected(file)
    event.target.value = ''
  }

  const handleSubmit = () => {
    const body = draft.trim()
    if (!body) return

    onSend({
      type: replyingTo ? 'reply' : 'text',
      body,
      replyToId: replyingTo?.id,
    })
    onDraftChange('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="composer-shell">
      {replyingTo ? (
        <div className="replying-bar">
          <span className="replying-bar-icon">
            <Reply size={14} strokeWidth={2} />
          </span>
          <span className="replying-bar-copy">
            <small>Replying to {replyingSender?.name ?? 'message'}</small>
            <strong>{replyingTo.body}</strong>
          </span>
          <button
            className="icon-button subtle compact"
            type="button"
            onClick={onCancelReply}
            aria-label="Cancel reply"
          >
            <X size={15} strokeWidth={1.8} />
          </button>
        </div>
      ) : null}

      <div className="composer-row">
        <div className="composer-tools">
          <button
            className={`composer-tool ${showAttachments ? 'is-active' : ''}`.trim()}
            type="button"
            onClick={() => setShowAttachments((open) => !open)}
            aria-label="Add attachment"
          >
            <Paperclip size={18} strokeWidth={1.8} />
          </button>
          <button
            className="composer-tool"
            type="button"
            onClick={() => openFilePicker('image/*,video/*')}
            aria-label="Add photo or video"
            title="Photo or video"
          >
            <ImageIcon size={18} strokeWidth={1.8} />
          </button>
          <button
            className="composer-tool"
            type="button"
            onClick={() => openFilePicker('audio/*')}
            aria-label="Add audio"
            title="Audio"
          >
            <Mic2 size={18} strokeWidth={1.8} />
          </button>
        </div>

        <textarea
          className="composer-input"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={replyingTo ? 'Write a reply…' : 'Write a message…'}
          rows={1}
          aria-label="Message input"
        />

        <div className="composer-actions">
          <button
            className={`composer-tool ${showEmoji ? 'is-active' : ''}`.trim()}
            type="button"
            onClick={() => setShowEmoji((open) => !open)}
            aria-label="Add emoji"
          >
            <Smile size={18} strokeWidth={1.8} />
          </button>
          <button
            className="composer-send-button"
            type="button"
            onClick={handleSubmit}
            disabled={!draft.trim()}
            aria-label="Send message"
          >
            <Send size={17} strokeWidth={2} />
          </button>
        </div>

        {showAttachments ? (
          <div className="attachment-menu">
            <button type="button" onClick={() => openFilePicker('image/*')}>
              <span className="attachment-menu-icon image-menu-icon">
                <ImageIcon size={16} strokeWidth={1.8} />
              </span>
              <span>
                <strong>Photo</strong>
                <small>Share an image</small>
              </span>
            </button>
            <button type="button" onClick={() => openFilePicker('video/*')}>
              <span className="attachment-menu-icon video-menu-icon">
                <Video size={16} strokeWidth={1.8} />
              </span>
              <span>
                <strong>Video</strong>
                <small>Share a short clip</small>
              </span>
            </button>
            <button type="button" onClick={() => openFilePicker('.pdf,.doc,.docx,.txt')}>
              <span className="attachment-menu-icon document-menu-icon">
                <FileText size={16} strokeWidth={1.8} />
              </span>
              <span>
                <strong>Document</strong>
                <small>Share a file</small>
              </span>
            </button>
            <button type="button" onClick={() => openFilePicker('audio/*')}>
              <span className="attachment-menu-icon audio-menu-icon">
                <Mic2 size={16} strokeWidth={1.8} />
              </span>
              <span>
                <strong>Audio</strong>
                <small>Send a voice note</small>
              </span>
            </button>
          </div>
        ) : null}

        {showEmoji ? (
          <div className="emoji-menu">
            {emojiOptions.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => {
                  onDraftChange(`${draft}${emoji}`)
                  setShowEmoji(false)
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : null}

        <input
          ref={fileInputRef}
          className="visually-hidden"
          type="file"
          accept={fileAccept}
          onChange={handleFileChange}
          tabIndex={-1}
        />
      </div>
      <div className="composer-hint">
        <span>Press Enter to send</span>
        <span>Shift + Enter for a new line</span>
      </div>
    </div>
  )
}
