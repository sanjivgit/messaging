import type { CSSProperties } from 'react'
import type { User } from '../../types/messaging'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type AvatarUser = Pick<User, 'name' | 'initials' | 'avatarColor'> &
  Partial<Pick<User, 'presence'>>

interface AvatarProps {
  user?: AvatarUser
  size?: AvatarSize
  showPresence?: boolean
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'avatar-xs',
  sm: 'avatar-sm',
  md: 'avatar-md',
  lg: 'avatar-lg',
  xl: 'avatar-xl',
}

export function Avatar({
  user,
  size = 'md',
  showPresence = false,
  className = '',
}: AvatarProps) {
  const style = {
    '--avatar-color': user?.avatarColor ?? '#dce4eb',
  } as CSSProperties

  return (
    <span
      className={`avatar ${sizeClasses[size]} ${className}`.trim()}
      style={style}
      title={user?.name}
      aria-label={user?.name}
    >
      <span>{user?.initials ?? '?'}</span>
      {showPresence && user?.presence ? (
        <span className={`presence-dot presence-${user.presence}`} />
      ) : null}
    </span>
  )
}
