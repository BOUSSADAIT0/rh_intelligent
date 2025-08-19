import { useNotificationStore } from '../../stores/notificationStore'

export function Toaster() {
  const { toasts, remove } = useNotificationStore()
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-96 max-w-[90vw] flex-col gap-2" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`card border-l-4 p-3 ${
          t.type === 'success' ? 'border-green-500' :
          t.type === 'error' ? 'border-red-500' :
          t.type === 'warning' ? 'border-yellow-500' : 'border-sky-500'
        }`}>
          {t.title && <div className="font-medium mb-1">{t.title}</div>}
          <div className="text-sm">{t.message}</div>
          <div className="mt-2 text-right">
            <button className="text-xs text-gray-500 hover:underline" onClick={() => remove(t.id)}>Fermer</button>
          </div>
        </div>
      ))}
    </div>
  )
}


