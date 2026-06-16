import emailjs from '@emailjs/browser'

function getConfig() {
  return {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  }
}

export function isContactConfigured() {
  const { serviceId, templateId, publicKey } = getConfig()
  return Boolean(serviceId && templateId && publicKey)
}

export async function sendContactInquiry({ name, email, phone, message }) {
  const { serviceId, templateId, publicKey } = getConfig()

  if (!isContactConfigured()) {
    throw new Error('Contact form is not configured yet.')
  }

  const trimmedPhone = phone?.trim() || ''

  await emailjs.send(
    serviceId,
    templateId,
    {
      title: 'JFD Design Website Lead',
      name: name.trim(),
      email: email.trim(),
      phone: trimmedPhone || 'Not provided',
      message: message.trim(),
      time: new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
      }),
    },
    { publicKey },
  )
}
