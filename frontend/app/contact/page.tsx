'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { contactAPI } from '@/lib/api'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    country: '',
    subject: '',
    message: '',
    agreed: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, agreed: e.target.checked }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreed) {
      toast.error('Please agree to the terms.')
      return
    }

    setIsSubmitting(true)

    try {
      await contactAPI.create({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone_number,
        country: formData.country,
        subject: formData.subject,
        message: formData.message
      })
      
      toast.success('Message sent successfully!')
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        country: '',
        subject: '',
        message: '',
        agreed: false
      })
    } catch (error) {
      console.error(error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#e8e6e1] pt-20">
      {/* Hero Section with Marquee */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Background Marquee Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
             <motion.div 
               animate={{ x: ["0%", "-50%"] }}
               transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
               className="whitespace-nowrap text-[15vw] font-serif text-[#1c1917] opacity-25 tracking-[0.1em] select-none"
               style={{ lineHeight: 1 }}
             >
               CONTACT CONTACT CONTACT
             </motion.div>
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            
            {/* Left Column: Location Info */}
            <div className="flex flex-col justify-center text-left">
                <p className="text-lg font-light text-[#1c1917] leading-relaxed">Based in Almaty</p>
            </div>

            {/* Center Column: Image */}
            <div className="flex justify-center items-center">
                 <div className="relative w-full max-w-[250px] md:max-w-[350px] aspect-[3/4]">
                    <img 
                      src="https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?q=80&w=800" 
                      alt="Almaty Mountains"
                      className="w-full h-full object-cover"
                    />
                 </div>
            </div>

            {/* Right Column: Contact Info */}
            <div className="flex flex-col justify-center md:items-end md:text-right items-start text-left">
                <p className="text-base md:text-lg font-light text-[#1c1917] leading-relaxed whitespace-nowrap">T. +7 707 422 7482</p>
                <p className="text-base md:text-lg font-light text-[#1c1917] leading-relaxed break-all md:break-normal">E. insilkyatradmc@gmail.com</p>
            </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full bg-[#e8e6e1] py-20 px-8">
        <div className="max-w-6xl mx-auto">

            {/* LET'S BEGIN Heading */}
            <div className="text-center mb-16">
                <h2 className="text-7xl md:text-8xl font-serif text-[#1c1917] tracking-wide">
                    LET&apos;S BEGIN
                </h2>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-12">
                {/* Row 1: Full Name & Email */}
                <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
                    <div className="relative">
                        <label className="block text-xs uppercase tracking-widest mb-3 text-[#1c1917]">
                            FULL NAME <span className="text-red-500">*</span>
                        </label>
                        <input 
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            type="text" 
                            required 
                            className="w-full bg-transparent border-b border-[#1c1917] py-4 outline-none text-base text-[#1c1917] focus:border-[#8b7355] transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-xs uppercase tracking-widest mb-3 text-[#1c1917]">
                            EMAIL <span className="text-red-500">*</span>
                        </label>
                        <input 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email" 
                            required 
                            className="w-full bg-transparent border-b border-[#1c1917] py-4 outline-none text-base text-[#1c1917] focus:border-[#8b7355] transition-colors"
                        />
                    </div>
                </div>

                {/* Row 2: Phone Number & Country */}
                <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
                    <div className="relative">
                        <label className="block text-xs uppercase tracking-widest mb-3 text-[#1c1917]">
                            PHONE NUMBER <span className="text-red-500">*</span>
                        </label>
                        <input 
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            type="tel" 
                            required 
                            className="w-full bg-transparent border-b border-[#1c1917] py-4 outline-none text-base text-[#1c1917] focus:border-[#8b7355] transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-xs uppercase tracking-widest mb-3 text-[#1c1917]">
                            COUNTRY
                        </label>
                        <select 
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-[#1c1917] py-4 outline-none text-base text-[#1c1917] focus:border-[#8b7355] transition-colors appearance-none cursor-pointer"
                        >
                            <option value=""></option>
                            <option value="Kazakhstan">Kazakhstan</option>
                            <option value="USA">USA</option>
                            <option value="UK">UK</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                            <option value="India">India</option>
                            <option value="China">China</option>
                            <option value="Japan">Japan</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Row 3: Subject */}
                <div className="relative">
                    <label className="block text-xs uppercase tracking-widest mb-3 text-[#1c1917]">
                        SUBJECT <span className="text-red-500">*</span>
                    </label>
                    <input 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        type="text" 
                        required 
                        className="w-full bg-transparent border-b border-[#1c1917] py-4 outline-none text-base text-[#1c1917] focus:border-[#8b7355] transition-colors"
                    />
                </div>

                {/* Row 4: Message */}
                <div className="relative">
                    <label className="block text-xs uppercase tracking-widest mb-3 text-[#1c1917]">
                        MESSAGE
                    </label>
                    <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6} 
                        className="w-full bg-transparent border-b border-[#1c1917] py-4 outline-none text-base text-[#1c1917] resize-none focus:border-[#8b7355] transition-colors"
                    ></textarea>
                </div>

                {/* Checkbox */}
                <div className="flex items-start gap-3 pt-6">
                    <input 
                        type="checkbox" 
                        id="agreed" 
                        checked={formData.agreed}
                        onChange={handleCheckbox}
                        className="mt-1 w-5 h-5 border-2 border-[#1c1917] text-[#1c1917] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="agreed" className="text-sm text-[#1c1917] leading-relaxed cursor-pointer">
                        I agree to the <a href="#" className="underline hover:text-[#8b7355] transition-colors">Terms of Use</a>, <a href="#" className="underline hover:text-[#8b7355] transition-colors">Privacy Policy</a> and <a href="#" className="underline hover:text-[#8b7355] transition-colors">Cookie Policy</a>.
                    </label>
                </div>

                {/* Submit Button */}
                <div className="pt-8 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="text-sm tracking-[0.3em] font-normal uppercase text-[#1c1917] hover:text-[#8b7355] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}
