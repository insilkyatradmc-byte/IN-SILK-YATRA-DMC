'use client'

import React from 'react'
import Link from 'next/link'

const categories = [
  {
    title: 'Cultural Tours',
    description: 'Immerse yourself in local traditions and history',
    href: '/tours?category=cultural',
    image: 'https://images.unsplash.com/photo-1549449615-9c8692780e06?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Adventure',
    description: 'Trekking and camel riding across deserts',
    href: '/tours?category=adventure',
    image: 'https://images.unsplash.com/photo-1545627253-dc0c1cc05bb9?q=80&w=600&auto=format&fit=crop'
  },
  {
    title: 'Luxury Stays',
    description: 'Experience the Silk Road in comfort',
    href: '/tours?category=luxury',
    image: 'https://images.unsplash.com/photo-1533052770281-22944b25c345?q=80&w=600&auto=format&fit=crop'
  }
]

export default function CategoryCards() {
  return (
    <section className="py-20 bg-stone-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif text-center mb-12 text-stone-900">Experience the Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link href={category.href} key={index} className="group relative block h-96 overflow-hidden rounded-lg">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                  <p className="text-white/90 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {category.description}
                  </p>
                </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
