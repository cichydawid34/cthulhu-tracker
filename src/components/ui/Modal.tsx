import * as React from "react"
import { X } from "lucide-react"

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-xl rounded-xl border shadow-lg p-6 relative my-auto">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 p-1 hover:bg-accent hover:text-accent-foreground cursor-pointer">
          <X className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-semibold leading-none tracking-tight mb-5">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  )
}
