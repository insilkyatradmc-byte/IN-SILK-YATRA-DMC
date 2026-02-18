export default function WhyChooseUs() {
  const features = [
    {
      title: 'Expert Local Guides',
      description: 'Our experienced guides know every hidden gem and cultural nuance.',
      icon: '🗺️',
    },
    {
      title: 'Luxury Accommodations',
      description: 'Stay in the finest hotels and resorts throughout Central Asia.',
      icon: '🏨',
    },
    {
      title: 'Customized Itineraries',
      description: 'Tailored travel experiences designed around your preferences.',
      icon: '✈️',
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock assistance during your entire journey.',
      icon: '📞',
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
