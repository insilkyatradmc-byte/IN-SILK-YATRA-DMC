export default function WhatsAppCTA() {
  const whatsappNumber = '77074227482' // Kazakhstan WhatsApp number
  const message = encodeURIComponent('Hello! I would like to know more about your tours.')

  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-xl mb-8">Get in touch with us on WhatsApp for instant assistance</p>
        <a
          href={`https://wa.me/${whatsappNumber}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
        >
          💬 Chat on WhatsApp
        </a>
      </div>
    </section>
  )
}
