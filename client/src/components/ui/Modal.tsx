import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  eyebrow?: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

export function Modal({
  title,
  eyebrow,
  onClose,
  children,
  wide = false,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className={`modal-card ${wide ? 'modal-card-wide' : ''}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
          </div>
          <button className="icon-button subtle" type="button" onClick={onClose} aria-label="Close">
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
