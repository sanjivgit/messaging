import { useMemo, useState } from 'react'
import { MessageCircle, Search, UserPlus, UsersRound } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import type { User } from '../../types/messaging'

interface ContactsViewProps {
  contacts: User[]
  onStartConversation: (userId: string) => void
  onNewConversation: () => void
}

export function ContactsView({
  contacts,
  onStartConversation,
  onNewConversation,
}: ContactsViewProps) {
  const [search, setSearch] = useState('')

  const visibleContacts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return contacts
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query),
    )
  }, [contacts, search])

  return (
    <section className="secondary-view" aria-label="Contacts">
      <div className="secondary-header">
        <div>
          <p className="eyebrow">People</p>
          <h1>Contacts</h1>
          <p className="secondary-subtitle">Keep your favorite people close at hand.</p>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={onNewConversation}
        >
          <UserPlus size={17} strokeWidth={1.9} />
          New conversation
        </button>
      </div>

      <div className="contact-overview-row">
        <div className="overview-card overview-card-coral">
          <span className="overview-icon">
            <UsersRound size={18} strokeWidth={1.8} />
          </span>
          <span>
            <strong>{contacts.length}</strong>
            <small>People in your circle</small>
          </span>
        </div>
        <div className="overview-card overview-card-mint">
          <span className="overview-icon">
            <MessageCircle size={18} strokeWidth={1.8} />
          </span>
          <span>
            <strong>{contacts.filter((contact) => contact.presence === 'online').length}</strong>
            <small>Available right now</small>
          </span>
        </div>
      </div>

      <div className="secondary-toolbar">
        <label className="search-field wide-search">
          <Search size={17} strokeWidth={1.8} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or number"
            aria-label="Search contacts"
          />
        </label>
        <span className="toolbar-caption">{visibleContacts.length} contacts</span>
      </div>

      <div className="contacts-grid">
        {visibleContacts.map((contact) => (
          <article className="contact-card" key={contact.id}>
            <div className="contact-card-topline">
              <Avatar user={contact} size="lg" showPresence />
              <span className={`contact-status-label contact-status-${contact.presence}`}>
                {contact.presence === 'online'
                  ? 'Online'
                  : contact.presence === 'away'
                    ? 'Away'
                    : 'Offline'}
              </span>
            </div>
            <div className="contact-card-copy">
              <h2>{contact.name}</h2>
              <p>{contact.phone}</p>
            </div>
            <button
              className="secondary-button full-width"
              type="button"
              onClick={() => onStartConversation(contact.id)}
            >
              <MessageCircle size={16} strokeWidth={1.8} />
              Message
            </button>
          </article>
        ))}
      </div>

      {visibleContacts.length === 0 ? (
        <div className="secondary-empty-state">
          <Search size={20} strokeWidth={1.7} />
          <strong>No contacts match that search.</strong>
        </div>
      ) : null}
    </section>
  )
}
