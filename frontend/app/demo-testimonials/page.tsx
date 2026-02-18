import { CleanTestimonial } from "@/components/ui/clean-testimonial"

const demoTestimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    content: "The attention to detail is unmatched. Every interaction feels intentional. This journey transformed our entire approach to travel.",
    country: "Singapore",
    photo: null,
  },
  {
    id: 2,
    name: "Marcus Webb",
    content: "Finally, someone who understands that simplicity is the ultimate sophistication. An unforgettable experience!",
    country: "United Kingdom",
    photo: null,
  },
  {
    id: 3,
    name: "Elena Frost",
    content: "This work redefined our entire approach to digital experiences. Absolutely phenomenal service and attention to detail.",
    country: "Canada",
    photo: null,
  },
]

export default function TestimonialDemoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-testimonial-background w-full">
      <div className="w-full">
        <CleanTestimonial testimonials={demoTestimonials} />
      </div>
    </main>
  )
}
