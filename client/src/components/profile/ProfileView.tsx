import { useState } from 'react'
import {
  Bell,
  Check,
  ChevronRight,
  Edit3,
  Globe2,
  LogOut,
  Moon,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import type { Presence, ProfileDraft, User } from '../../types/messaging'

interface ProfileViewProps {
  currentUser: User
  conversationCount: number
  contactCount: number
  groupCount: number
  onSave: (draft: ProfileDraft) => void
  onSignOut: () => void
}

const presenceOptions: Array<{ value: Presence; label: string }> = [
  { value: 'online', label: 'Online' },
  { value: 'away', label: 'Away' },
  { value: 'offline', label: 'Invisible' },
]

export function ProfileView({
  currentUser,
  conversationCount,
  contactCount,
  groupCount,
  onSave,
  onSignOut,
}: ProfileViewProps) {
  const [name, setName] = useState(currentUser.name)
  const [bio, setBio] = useState(currentUser.bio ?? '')
  const [presence, setPresence] = useState<Presence>(currentUser.presence)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave({ name: name.trim() || currentUser.name, bio, presence })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <section className="secondary-view profile-view" aria-label="Your profile">
      <div className="secondary-header">
        <div>
          <p className="eyebrow">A little about you</p>
          <h1>Your profile</h1>
          <p className="secondary-subtitle">Make it easy for the right people to find you.</p>
        </div>
        <button className="secondary-button" type="button" onClick={onSignOut}>
          <LogOut size={16} strokeWidth={1.8} />
          Sign out
        </button>
      </div>

      <div className="profile-layout">
        <div className="profile-main-column">
          <div className="profile-card profile-card-large">
            <div className="profile-card-banner" />
            <div className="profile-identity-row">
              <div className="profile-avatar-wrap">
                <Avatar user={{ ...currentUser, name, initials: getInitials(name), presence }} size="xl" showPresence />
                <button className="profile-avatar-edit" type="button" aria-label="Edit profile photo">
                  <Edit3 size={14} strokeWidth={1.9} />
                </button>
              </div>
              <div className="profile-identity-copy">
                <span className="profile-username">@{name.toLowerCase().replace(/\s+/g, '.')}</span>
                <h2>{name}</h2>
                <p>{currentUser.phone}</p>
              </div>
              <span className="profile-edit-label">
                <Edit3 size={14} strokeWidth={1.8} />
                Edit profile
              </span>
            </div>

            <div className="profile-form-grid">
              <label className="field-label">
                <span>Display name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                />
              </label>
              <label className="field-label">
                <span>Mobile number</span>
                <input type="tel" value={currentUser.phone} readOnly />
              </label>
              <label className="field-label field-span-two">
                <span>Short bio</span>
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="What would you like people to know?"
                  rows={3}
                />
              </label>
            </div>

            <div className="profile-form-footer">
              <div className="presence-picker">
                <span className="field-label-copy">Your presence</span>
                <div className="presence-options">
                  {presenceOptions.map((option) => (
                    <button
                      className={`presence-option ${presence === option.value ? 'is-active' : ''}`.trim()}
                      type="button"
                      key={option.value}
                      onClick={() => setPresence(option.value)}
                    >
                      <span className={`presence-option-dot presence-${option.value}`} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <button className="primary-button" type="button" onClick={handleSave}>
                {saved ? <Check size={16} strokeWidth={2} /> : null}
                {saved ? 'Saved' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>

        <aside className="profile-side-column">
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <span className="profile-stat-icon stat-icon-coral">
                <UserRound size={16} strokeWidth={1.8} />
              </span>
              <strong>{conversationCount}</strong>
              <small>Chats</small>
            </div>
            <div className="profile-stat-card">
              <span className="profile-stat-icon stat-icon-mint">
                <Sparkles size={16} strokeWidth={1.8} />
              </span>
              <strong>{contactCount}</strong>
              <small>Contacts</small>
            </div>
            <div className="profile-stat-card">
              <span className="profile-stat-icon stat-icon-lavender">
                <Globe2 size={16} strokeWidth={1.8} />
              </span>
              <strong>{groupCount}</strong>
              <small>Groups</small>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-heading">
              <div>
                <p className="eyebrow">Preferences</p>
                <h2>Settings</h2>
              </div>
              <ShieldCheck size={19} strokeWidth={1.7} className="settings-shield" />
            </div>
            <button className="settings-row" type="button">
              <span className="settings-row-icon">
                <Bell size={16} strokeWidth={1.8} />
              </span>
              <span>
                <strong>Notifications</strong>
                <small>Message sounds and previews</small>
              </span>
              <ChevronRight size={16} strokeWidth={1.8} />
            </button>
            <button className="settings-row" type="button">
              <span className="settings-row-icon">
                <Moon size={16} strokeWidth={1.8} />
              </span>
              <span>
                <strong>Appearance</strong>
                <small>Light, calm, and focused</small>
              </span>
              <ChevronRight size={16} strokeWidth={1.8} />
            </button>
            <button className="settings-row" type="button">
              <span className="settings-row-icon">
                <ShieldCheck size={16} strokeWidth={1.8} />
              </span>
              <span>
                <strong>Privacy</strong>
                <small>Keep your conversations yours</small>
              </span>
              <ChevronRight size={16} strokeWidth={1.8} />
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
