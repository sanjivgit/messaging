import { useEffect, useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { OnboardingScreen } from './components/auth/OnboardingScreen'
import { ChatPanel } from './components/chat/ChatPanel'
import { ConversationList } from './components/chat/ConversationList'
import { ContactsView } from './components/contacts/ContactsView'
import { GroupsView } from './components/groups/GroupsView'
import { Sidebar } from './components/layout/Sidebar'
import { NewConversationModal } from './components/modals/NewConversationModal'
import { NewGroupModal } from './components/modals/NewGroupModal'
import { ProfileView } from './components/profile/ProfileView'
import { contacts, currentUser, initialConversations } from './data/mockData'
import type {
  AppView,
  Conversation,
  ConversationFilter,
  Message,
  NewMessage,
  ProfileDraft,
  User,
} from './types/messaging'
import './App.css'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function formatTime() {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function messagePreview(message: NewMessage) {
  if (message.type === 'image') return `Photo · ${message.body}`
  if (message.type === 'video') return `Video · ${message.body}`
  if (message.type === 'document') return `Document · ${message.fileName ?? message.body}`
  if (message.type === 'audio') return 'Voice message'
  if (message.type === 'reply') return `↩ ${message.body}`
  return message.body
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User>(currentUser)
  const [activeView, setActiveView] = useState<AppView>('chats')
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedConversationId, setSelectedConversationId] = useState(
    initialConversations[0]?.id ?? '',
  )
  const [conversationSearch, setConversationSearch] = useState('')
  const [conversationFilter, setConversationFilter] =
    useState<ConversationFilter>('all')
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [draft, setDraft] = useState('')
  const [mobileChatOpen, setMobileChatOpen] = useState(false)
  const [modal, setModal] = useState<'conversation' | 'group' | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const users = useMemo(() => [user, ...contacts], [user])
  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId,
  )

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const showToast = (message: string) => setToast(message)

  const handleLogin = ({ name, phone }: { name: string; phone: string }) => {
    setUser((previousUser) => ({
      ...previousUser,
      name,
      phone,
      initials: getInitials(name),
    }))
    setIsAuthenticated(true)
    setActiveView('chats')
    showToast('Welcome to your new space ✨')
  }

  const handleViewChange = (view: AppView) => {
    setActiveView(view)
    if (view === 'chats') setMobileChatOpen(false)
  }

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    setActiveView('chats')
    setMobileChatOpen(true)
    setReplyingTo(null)
  }

  const handleStartConversation = (userId: string) => {
    const contact = contacts.find((item) => item.id === userId)
    if (!contact) return

    const existingConversation = conversations.find(
      (conversation) =>
        conversation.type === 'direct' && conversation.participantIds.includes(contact.id),
    )

    if (existingConversation) {
      handleSelectConversation(existingConversation.id)
      setModal(null)
      showToast(`Opening your chat with ${contact.name}`)
      return
    }

    const newConversation: Conversation = {
      id: `conversation-${contact.id}-${Date.now()}`,
      type: 'direct',
      name: contact.name,
      initials: contact.initials,
      avatarColor: contact.avatarColor,
      participantIds: [user.id, contact.id],
      lastMessage: 'Start a new conversation',
      lastMessageAt: 'now',
      unreadCount: 0,
      presence: contact.presence,
      messages: [],
    }

    setConversations((previous) => [newConversation, ...previous])
    setSelectedConversationId(newConversation.id)
    setActiveView('chats')
    setMobileChatOpen(true)
    setModal(null)
    showToast(`New conversation with ${contact.name}`)
  }

  const handleCreateGroup = (name: string, memberIds: string[], description: string) => {
    const newGroup: Conversation = {
      id: `group-${Date.now()}`,
      type: 'group',
      name,
      initials: getInitials(name),
      avatarColor: '#b8a6e8',
      participantIds: [user.id, ...memberIds],
      lastMessage: `${name} is ready to begin`,
      lastMessageAt: 'now',
      unreadCount: 0,
      presence: 'online',
      description: description || 'A new shared space for good conversations.',
      messages: [
        {
          id: `group-message-${Date.now()}`,
          senderId: user.id,
          type: 'text',
          body: `Welcome to ${name}. This is our little corner for good conversations.`,
          time: 'now',
          isRead: true,
        },
      ],
    }

    setConversations((previous) => [newGroup, ...previous])
    setSelectedConversationId(newGroup.id)
    setActiveView('chats')
    setMobileChatOpen(true)
    setModal(null)
    showToast(`${name} is ready ✨`)
  }

  const handleSendMessage = (newMessage: NewMessage) => {
    if (!selectedConversationId) return

    const message: Message = {
      id: `message-${Date.now()}`,
      senderId: user.id,
      type: newMessage.type,
      body: newMessage.body,
      time: formatTime(),
      replyToId: newMessage.replyToId,
      fileName: newMessage.fileName,
      fileSize: newMessage.fileSize,
      duration: newMessage.duration,
      previewUrl: newMessage.previewUrl,
      isRead: false,
    }

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === selectedConversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, message],
              lastMessage: messagePreview(newMessage),
              lastMessageAt: 'now',
              unreadCount: 0,
            }
          : conversation,
      ),
    )
    setReplyingTo(null)
    setDraft('')
  }

  const handleFileSelected = (file: File) => {
    const fileType = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('video/')
        ? 'video'
        : file.type.startsWith('audio/')
          ? 'audio'
          : 'document'
    const isPreviewable = fileType === 'image' || fileType === 'video' || fileType === 'audio'

    handleSendMessage({
      type: fileType,
      body: file.name,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      duration: fileType === 'audio' ? '0:00' : undefined,
      previewUrl: isPreviewable ? URL.createObjectURL(file) : undefined,
    })
    showToast(`${fileType[0].toUpperCase()}${fileType.slice(1)} attached`)
  }

  const handleOpenProfile = (userId: string) => {
    if (userId === user.id) {
      setActiveView('profile')
      setMobileChatOpen(false)
      return
    }

    const otherUser = contacts.find((contact) => contact.id === userId)
    showToast(`${otherUser?.name ?? 'This person'}’s profile is ready for the next preview.`)
  }

  const handleSaveProfile = ({ name, bio, presence }: ProfileDraft) => {
    setUser((previousUser) => ({
      ...previousUser,
      name,
      bio,
      presence,
      initials: getInitials(name),
    }))
    showToast('Profile changes saved')
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setActiveView('chats')
    setMobileChatOpen(false)
    setReplyingTo(null)
    setDraft('')
  }

  if (!isAuthenticated) {
    return <OnboardingScreen onLogin={handleLogin} />
  }

  return (
    <div className="app-frame">
      <div className="messenger-shell">
        <Sidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          currentUser={user}
          onCreateGroup={() => setModal('group')}
          onSignOut={handleSignOut}
        />

        <main className="workspace">
          {activeView === 'chats' ? (
            <div className={`chat-layout ${mobileChatOpen ? 'mobile-chat-open' : ''}`.trim()}>
              <ConversationList
                conversations={conversations}
                users={users}
                selectedId={selectedConversationId}
                onSelect={handleSelectConversation}
                onNewConversation={() => setModal('conversation')}
                search={conversationSearch}
                onSearchChange={setConversationSearch}
                filter={conversationFilter}
                onFilterChange={setConversationFilter}
              />
              <ChatPanel
                conversation={selectedConversation}
                users={users}
                currentUser={user}
                replyingTo={replyingTo}
                onReply={(message) => {
                  setReplyingTo(message)
                  setDraft('')
                }}
                onCancelReply={() => setReplyingTo(null)}
                onSend={handleSendMessage}
                onFileSelected={handleFileSelected}
                onOpenProfile={handleOpenProfile}
                onBack={() => setMobileChatOpen(false)}
                draft={draft}
                onDraftChange={setDraft}
              />
            </div>
          ) : null}

          {activeView === 'contacts' ? (
            <ContactsView
              contacts={contacts}
              onStartConversation={handleStartConversation}
              onNewConversation={() => setModal('conversation')}
            />
          ) : null}

          {activeView === 'groups' ? (
            <GroupsView
              conversations={conversations}
              users={users}
              onSelect={handleSelectConversation}
              onCreateGroup={() => setModal('group')}
            />
          ) : null}

          {activeView === 'profile' ? (
            <ProfileView
              currentUser={user}
              conversationCount={conversations.length}
              contactCount={contacts.length}
              groupCount={conversations.filter((conversation) => conversation.type === 'group').length}
              onSave={handleSaveProfile}
              onSignOut={handleSignOut}
            />
          ) : null}
        </main>
      </div>

      {modal === 'conversation' ? (
        <NewConversationModal
          contacts={contacts}
          onClose={() => setModal(null)}
          onSelect={handleStartConversation}
        />
      ) : null}
      {modal === 'group' ? (
        <NewGroupModal
          contacts={contacts}
          onClose={() => setModal(null)}
          onCreate={handleCreateGroup}
        />
      ) : null}

      {toast ? (
        <div className="toast-message" role="status">
          <span className="toast-icon">
            <Check size={14} strokeWidth={2.4} />
          </span>
          <span>{toast}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification">
            <X size={14} strokeWidth={1.8} />
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default App
