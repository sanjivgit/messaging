import { useState, type FormEvent } from 'react'
import {
  ArrowRight,
  Check,
  LockKeyhole,
  MessageCircle,
  Sparkles,
  UsersRound,
} from 'lucide-react'

interface OnboardingScreenProps {
  onLogin: (details: { name: string; phone: string }) => void
}

export function OnboardingScreen({ onLogin }: OnboardingScreenProps) {
  const [name, setName] = useState('Alex Morgan')
  const [phone, setPhone] = useState('98765 43210')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const digits = phone.replace(/\D/g, '')

    if (digits.length < 7) {
      setError('Enter a valid mobile number to continue.')
      return
    }

    setError('')
    onLogin({
      name: name.trim() || 'Alex Morgan',
      phone: `+91 ${digits.slice(-10).padStart(10, '0')}`,
    })
  }

  return (
    <div className="onboarding-screen">
      <div className="onboarding-shell">
        <section className="onboarding-story">
          <div className="onboarding-story-top">
            <div className="onboarding-brand">
              <span className="brand-mark brand-mark-light">
                <span />
                <span />
              </span>
              <span>mingle</span>
            </div>
            <span className="story-status-pill">
              <span className="online-pulse" />
              A calmer inbox
            </span>
          </div>

          <div className="onboarding-story-copy">
            <p className="story-eyebrow">Your people, in one place</p>
            <h1>Good conversations start small.</h1>
            <p>
              A friendly space for the people you care about — from quick replies to the
              plans you will remember.
            </p>
          </div>

          <div className="onboarding-preview" aria-hidden="true">
            <div className="preview-glow preview-glow-one" />
            <div className="preview-glow preview-glow-two" />
            <div className="preview-card preview-card-back">
              <span className="preview-card-label">Your circle</span>
              <div className="preview-avatar-row">
                <span className="preview-avatar preview-avatar-coral">AM</span>
                <span className="preview-avatar preview-avatar-lilac">MC</span>
                <span className="preview-avatar preview-avatar-mint">JL</span>
                <span className="preview-avatar preview-avatar-blue">+4</span>
              </div>
            </div>
            <div className="preview-card preview-card-main">
              <div className="preview-card-header">
                <span className="preview-mini-avatar">MC</span>
                <span>
                  <strong>Maya Chen</strong>
                  <small>Active now</small>
                </span>
                <span className="preview-online-dot" />
              </div>
              <div className="preview-message preview-message-incoming">
                Hey Alex! Coffee this weekend?
              </div>
              <div className="preview-message preview-message-outgoing">Saturday works ✨</div>
              <div className="preview-reply">
                <span>↩</span>
                <span>That sounds perfect.</span>
              </div>
            </div>
          </div>

          <div className="story-footer">
            <span>
              <LockKeyhole size={14} strokeWidth={1.8} />
              No API. No noise. Just the UI.
            </span>
            <span>Made for easy onboarding</span>
          </div>
        </section>

        <section className="onboarding-form-panel">
          <div className="mobile-onboarding-brand">
            <span className="brand-mark">
              <span />
              <span />
            </span>
            <span>mingle</span>
          </div>
          <div className="onboarding-form-heading">
            <span className="form-icon-badge">
              <MessageCircle size={19} strokeWidth={1.8} />
            </span>
            <p className="eyebrow">Welcome in</p>
            <h2>Let’s get you started.</h2>
            <p>Use your mobile number to create your space. No verification code needed.</p>
          </div>

          <form className="onboarding-form" onSubmit={handleSubmit}>
            <label className="field-label">
              <span>Your name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="What should people call you?"
                autoComplete="name"
              />
            </label>
            <label className="field-label">
              <span>Mobile number</span>
              <span className="phone-input-wrap">
                <span className="country-code">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="98765 43210"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </span>
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button className="primary-button onboarding-submit" type="submit">
              Continue to messages
              <ArrowRight size={17} strokeWidth={2} />
            </button>
          </form>

          <div className="onboarding-assurance">
            <span className="assurance-icon">
              <Check size={14} strokeWidth={2.2} />
            </span>
            <span>
              <strong>Simple by design</strong>
              <small>We only use this to create your demo profile.</small>
            </span>
          </div>

          <div className="onboarding-feature-list">
            <span>
              <UsersRound size={14} strokeWidth={1.8} />
              One-to-one chats
            </span>
            <span>
              <Sparkles size={14} strokeWidth={1.8} />
              Groups that feel easy
            </span>
          </div>

          <p className="onboarding-legal">
            By continuing, you agree to keep this a friendly place for your people.
          </p>
        </section>
      </div>
    </div>
  )
}
