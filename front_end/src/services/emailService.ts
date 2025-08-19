import { useNotificationStore } from '../stores/notificationStore'

export async function sendEmail(to: string, subject: string, body: string) {
  await new Promise(r => setTimeout(r, 400))
  useNotificationStore.getState().push({ type: 'success', title: 'Email envoyé', message: `À ${to} · ${subject}` })
}


