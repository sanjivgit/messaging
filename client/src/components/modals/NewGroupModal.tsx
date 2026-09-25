import { useMemo, useState, type FormEvent } from 'react'
import { Check, Plus, Search, UsersRound } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Avatar } from '../ui/Avatar'
import type { User } from '../../types/messaging'

interface NewGroupModalProps {
  contacts: User[]
  onClose: () => void
  onCreate: (name: string, memberIds: string[], description: string) => void
}

export function NewGroupModal({
  contacts,
  onClose,
  onCreate,
}: NewGroupModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return contacts
    return contacts.filter((contact) => contact.name.toLowerCase().includes(query))
  }, [contacts, search])

  const toggleMember = (userId: string) => {
    setSelectedIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId],
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim() || selectedIds.length === 0) return
    onCreate(name.trim(), selectedIds, description.trim())
  }

  return (
    <Modal title="Create a group" eyebrow="A new shared space" onClose={onClose} wide>
      <form className="modal-body" onSubmit={handleSubmit}>
        <p className="modal-description">
          Give your group a name and choose at least one person to bring along.
        </p>
        <label className="field-label">
          <span>Group name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Weekend plans"
            autoFocus
          />
        </label>
        <label className="field-label">
          <span>Group description <em>Optional</em></span>
          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this space for?"
          />
        </label>
        <div className="member-picker-heading">
          <span>
            <UsersRound size={15} strokeWidth={1.8} />
            Add people
          </span>
          <small>{selectedIds.length} selected</small>
        </div>
        <label className="search-field modal-search-field">
          <Search size={17} strokeWidth={1.8} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your contacts"
            aria-label="Search group members"
          />
        </label>
        <div className="member-picker-list">
          {filteredContacts.map((contact) => {
            const selected = selectedIds.includes(contact.id)
            return (
              <button
                className={`member-picker-row ${selected ? 'is-selected' : ''}`.trim()}
                type="button"
                key={contact.id}
                onClick={() => toggleMember(contact.id)}
              >
                <Avatar user={contact} size="sm" />
                <span>
                  <strong>{contact.name}</strong>
                  <small>{contact.phone}</small>
                </span>
                <span className="member-check">
                  {selected ? <Check size={14} strokeWidth={2.4} /> : <Plus size={14} strokeWidth={1.8} />}
                </span>
              </button>
            )
          })}
        </div>
        <div className="modal-footer">
          <span className="modal-footer-note">
            <span className="online-pulse" />
            Everyone sees the group after you create it
          </span>
          <button
            className="primary-button"
            type="submit"
            disabled={!name.trim() || selectedIds.length === 0}
          >
            <Plus size={16} strokeWidth={2} />
            Create group
          </button>
        </div>
      </form>
    </Modal>
  )
}
