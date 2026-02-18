'use client'

import { useEffect, useState, memo } from 'react'
import { testimonialsAPI } from '@/lib/api'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { CleanTestimonial } from '@/components/ui/clean-testimonial'

interface Testimonial {
  id: number
  name: string
  content: string
  photo: string | null
  country: string | null
}

const Testimonials = memo(function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await testimonialsAPI.getAll()
        setTestimonials(response.data.data)
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-testimonial-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-testimonial-foreground">What Our Clients Say</h2>
          <div className="text-center py-8">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-testimonial-muted">Loading testimonials...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-testimonial-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-testimonial-foreground">What Our Clients Say</h2>
        <CleanTestimonial testimonials={testimonials} />
      </div>
    </section>
  )
})

export default Testimonials
