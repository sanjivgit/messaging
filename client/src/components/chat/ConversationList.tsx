import { useMemo } from 'react'
import {
  MessageCircle,
  MoreHorizontal,
  PencilLine,
  Pin,
  Search,
  SlidersHorizontal,
  UsersRound,
} from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import type {
  Conversation,
  ConversationFilter,
  User,
} from '../../types/messaging'

interface ConversationListProps {
  conversations: Conversation[]
  users: User[]
  selectedId: string
  onSelect: (id: string) => void
  onNewConversation: () => void
  search: string
  onSearchChange: (value: string) => void
  filter: ConversationFilter
  onFilterChange: (value: ConversationFilter) => void
}

const filterItems: Array<{ id: ConversationFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'groups', label: 'Groups' },
]

export function ConversationList({
  conversations,
  users,
  selectedId,
  onSelect,
  onNewConversation,
  search,
  onSearchChange,
  filter,
  onFilterChange,
}: ConversationListProps) {
  const userMap = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users],
  )

  const visibleConversations = useMemo(() => {
    const query = search.trim().toLowerCase()

    return conversations.filter((conversation) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'unread' && conversation.unreadCount > 0) ||
        (filter === 'groups' && conversation.type === 'group')
      const matchesSearch =
        !query ||
        conversation.name.toLowerCase().includes(query) ||
        conversation.lastMessage.toLowerCase().includes(query)

      return matchesFilter && matchesSearch
    })
  }, [conversations, filter, search])

  return (
    <section className="conversation-pane" aria-label="Conversations">
      <div className="conversation-header">
        <div>
          <p className="eyebrow">Your space</p>
          <h1>Messages</h1>
        </div>
        <button
          className="icon-button accent"
          type="button"
          onClick={onNewConversation}
          aria-label="Start a new conversation"
          title="New conversation"
        >
          <PencilLine size={18} strokeWidth={1.9} />
        </button>
      </div>

      <div className="conversation-tools">
        <label className="search-field">
          <Search size={17} strokeWidth={1.8} />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search conversations"
            aria-label="Search conversations"
          />
          <kbd>⌘ K</kbd>
        </label>
        <button className="filter-button" type="button" aria-label="Filter conversations">
          <SlidersHorizontal size={16} strokeWidth={1.8} />
        </button>
      </div>

      <div className="conversation-filters" role="tablist" aria-label="Conversation filters">
        {filterItems.map((item) => (
          <button
            className={`conversation-filter ${filter === item.id ? 'is-active' : ''}`.trim()}
            type="button"
            key={item.id}
            onClick={() => onFilterChange(item.id)}
            role="tab"
            aria-selected={filter === item.id}
          >
            {item.label}
            {item.id === 'unread' ? (
              <span className="filter-count">
                {conversations.filter((conversation) => conversation.unreadCount > 0).length}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="conversation-list">
        {visibleConversations.length > 0 ? (
          visibleConversations.map((conversation) => {
            const otherUser =
              conversation.type === 'direct'
                ? userMap.get(
                    conversation.participantIds.find((id) => id !== 'me') ?? '',
                  )
                : undefined

            return (
              <button
                className={`conversation-row ${selectedId === conversation.id ? 'is-selected' : ''}`.trim()}
                type="button"
                key={conversation.id}
                onClick={() => onSelect(conversation.id)}
              >
                <Avatar
                  user={otherUser ?? conversation}
                  size="md"
                  showPresence={conversation.type === 'direct'}
                />
                <span className="conversation-row-copy">
                  <span className="conversation-row-topline">
                    <strong>{conversation.name}</strong>
                    <span className="conversation-row-time">{conversation.lastMessageAt}</span>
                  </span>
                  <span className="conversation-row-bottomline">
                    <span className="conversation-row-preview">
                      {conversation.type === 'group' ? (
                        <UsersRound size={13} strokeWidth={1.8} />
                      ) : (
                        <MessageCircle size={13} strokeWidth={1.8} />
                      )}
                      {conversation.lastMessage}
                    </span>
                    <span className="conversation-row-meta">
                      {conversation.pinned ? <Pin size={13} strokeWidth={1.8} /> : null}
                      {conversation.unreadCount > 0 ? (
                        <span className="unread-count">{conversation.unreadCount}</span>
                      ) : null}
                    </span>
                  </span>
                </span>
              </button>
            )
          })
        ) : (
          <div className="conversation-empty">
            <span className="empty-icon">
              <Search size={18} strokeWidth={1.7} />
            </span>
            <strong>No conversations found</strong>
            <span>Try a different search or filter.</span>
          </div>
        )}
      </div>

      <div className="conversation-footer">
        <span className="online-pulse" />
        <span>{conversations.length} conversations in your space</span>
        <button type="button" className="conversation-footer-more" aria-label="More options">
          <MoreHorizontal size={17} strokeWidth={1.8} />
        </button>
      </div>
    </section>
  )
}
