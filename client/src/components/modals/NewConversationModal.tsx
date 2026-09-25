import { useMemo, useState } from 'react'
import { MessageCircle, Search } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Avatar } from '../ui/Avatar'
import type { User } from '../../types/messaging'

interface NewConversationModalProps {
  contacts: User[]
  onClose: () => void
  onSelect: (userId: string) => void
}

export function NewConversationModal({
  contacts,
  onClose,
  onSelect,
}: NewConversationModalProps) {
  const [search, setSearch] = useState('')

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return contacts
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query),
    )
  }, [contacts, search])

  return (
    <Modal title="Start a conversation" eyebrow="New message" onClose={onClose}>
      <div className="modal-body">
        <p className="modal-description">Choose someone from your contacts to get started.</p>
        <label className="search-field modal-search-field">
          <Search size={17} strokeWidth={1.8} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search contacts"
            aria-label="Search contacts"
            autoFocus
          />
        </label>
        <div className="modal-contact-list">
          {filteredContacts.map((contact) => (
            <button
              className="modal-contact-row"
              type="button"
              key={contact.id}
              onClick={() => onSelect(contact.id)}
            >
              <Avatar user={contact} size="md" showPresence />
              <span className="modal-contact-copy">
                <strong>{contact.name}</strong>
                <small>{contact.phone}</small>
              </span>
              <span className="modal-contact-action">
                <MessageCircle size={16} strokeWidth={1.8} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}
