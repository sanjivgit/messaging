import {
  LogOut,
  MessageCircle,
  Plus,
  Sparkles,
  UserRound,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import type { AppView, User } from '../../types/messaging'

interface SidebarProps {
  activeView: AppView
  onViewChange: (view: AppView) => void
  currentUser: User
  onCreateGroup: () => void
  onSignOut: () => void
}

const navigationItems: Array<{
  id: AppView
  label: string
  icon: LucideIcon
}> = [
  { id: 'chats', label: 'Chats', icon: MessageCircle },
  { id: 'contacts', label: 'Contacts', icon: UsersRound },
  { id: 'groups', label: 'Groups', icon: Sparkles },
  { id: 'profile', label: 'Profile', icon: UserRound },
]

export function Sidebar({
  activeView,
  onViewChange,
  currentUser,
  onCreateGroup,
  onSignOut,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <button
        className="sidebar-brand"
        type="button"
        onClick={() => onViewChange('chats')}
        aria-label="Go to chats"
      >
        <span className="brand-mark">
          <span />
          <span />
        </span>
        <span className="brand-name">mingle</span>
      </button>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        {navigationItems.map(({ id, label, icon: Icon }) => (
          <button
            className={`sidebar-nav-item ${activeView === id ? 'is-active' : ''}`.trim()}
            type="button"
            key={id}
            onClick={() => onViewChange(id)}
            aria-current={activeView === id ? 'page' : undefined}
          >
            <span className="sidebar-nav-icon">
              <Icon size={19} strokeWidth={activeView === id ? 2.2 : 1.8} />
            </span>
            <span className="sidebar-nav-label">{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          className="sidebar-create-button"
          type="button"
          onClick={onCreateGroup}
          aria-label="Create a group"
          title="Create a group"
        >
          <Plus size={19} strokeWidth={2.2} />
        </button>
        <button
          className="sidebar-profile-button"
          type="button"
          onClick={() => onViewChange('profile')}
          title="Open your profile"
        >
          <Avatar user={currentUser} size="sm" showPresence />
          <span className="sidebar-profile-copy">
            <strong>{currentUser.name.split(' ')[0]}</strong>
            <small>Online</small>
          </span>
        </button>
        <button
          className="sidebar-logout"
          type="button"
          onClick={onSignOut}
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={17} strokeWidth={1.8} />
        </button>
      </div>
    </aside>
  )
}
