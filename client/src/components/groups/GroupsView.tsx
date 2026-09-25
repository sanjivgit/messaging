import { ArrowUpRight, MessageCircle, Plus, Sparkles } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import type { Conversation, User } from '../../types/messaging'

interface GroupsViewProps {
  conversations: Conversation[]
  users: User[]
  onSelect: (conversationId: string) => void
  onCreateGroup: () => void
}

export function GroupsView({
  conversations,
  users,
  onSelect,
  onCreateGroup,
}: GroupsViewProps) {
  const groups = conversations.filter((conversation) => conversation.type === 'group')
  const userMap = new Map(users.map((user) => [user.id, user]))

  return (
    <section className="secondary-view" aria-label="Groups">
      <div className="secondary-header">
        <div>
          <p className="eyebrow">Together, separately</p>
          <h1>Groups</h1>
          <p className="secondary-subtitle">Make a little room for the conversations that matter.</p>
        </div>
        <button className="primary-button" type="button" onClick={onCreateGroup}>
          <Plus size={17} strokeWidth={2} />
          Create group
        </button>
      </div>

      <div className="group-feature-card">
        <div className="group-feature-copy">
          <span className="feature-sparkle">
            <Sparkles size={17} strokeWidth={1.8} />
          </span>
          <div>
            <p className="eyebrow">A softer way to collaborate</p>
            <h2>Bring your people into one place.</h2>
            <p>Create a shared space for plans, updates, and the little moments in between.</p>
          </div>
        </div>
        <button className="light-button" type="button" onClick={onCreateGroup}>
          Start a group
          <ArrowUpRight size={16} strokeWidth={1.8} />
        </button>
      </div>

      <div className="section-heading-row">
        <div>
          <h2>Your groups</h2>
          <span>{groups.length} shared spaces</span>
        </div>
      </div>

      <div className="groups-grid">
        {groups.map((group) => {
          const members = group.participantIds
            .map((id) => userMap.get(id))
            .filter(Boolean) as User[]

          return (
            <button
              className="group-card"
              type="button"
              key={group.id}
              onClick={() => onSelect(group.id)}
            >
              <div className="group-card-visual" style={{ background: group.avatarColor }}>
                <span>{group.initials}</span>
                <span className="group-card-orbit group-card-orbit-one" />
                <span className="group-card-orbit group-card-orbit-two" />
              </div>
              <div className="group-card-copy">
                <div className="group-card-title-row">
                  <h3>{group.name}</h3>
                  <ArrowUpRight size={16} strokeWidth={1.8} />
                </div>
                <p>{group.description ?? 'A shared space for good conversations.'}</p>
                <div className="group-card-footer">
                  <span className="avatar-stack">
                    {members.slice(0, 3).map((member) => (
                      <Avatar key={member.id} user={member} size="xs" />
                    ))}
                    {members.length > 3 ? <span className="avatar-overflow">+{members.length - 3}</span> : null}
                  </span>
                  <span className="group-last-message">
                    <MessageCircle size={13} strokeWidth={1.8} />
                    {group.lastMessage}
                  </span>
                </div>
              </div>
            </button>
          )
        })}

        <button className="create-group-card" type="button" onClick={onCreateGroup}>
          <span className="create-group-icon">
            <Plus size={20} strokeWidth={1.8} />
          </span>
          <strong>Create a new group</strong>
          <span>Start a shared space with your people.</span>
        </button>
      </div>
    </section>
  )
}
