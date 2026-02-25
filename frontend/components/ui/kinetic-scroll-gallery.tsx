'use client'

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PremiumPhotoCarousel from "./premium-photo-carousel";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export default function KineticScrollGallery() {
    const [carousel1Images, setCarousel1Images] = useState<string[]>([])
    const [carousel2Images, setCarousel2Images] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchJourneyPhotos()
    }, [])

    const fetchJourneyPhotos = async () => {
        try {
            const response = await fetch(`${API_URL}/journey-photos`)
            const result = await response.json()
            
            // Access nested data structure: result.data.carousel1
            const data = result.data || result
            
            if (data.carousel1) {
                const images1 = Array.isArray(data.carousel1) 
                    ? data.carousel1 
                    : data.carousel1.map((photo: any) => photo.photo_url || photo)
                setCarousel1Images(images1)
            }
            if (data.carousel2) {
                const images2 = Array.isArray(data.carousel2)
                    ? data.carousel2
                    : data.carousel2.map((photo: any) => photo.photo_url || photo)
                setCarousel2Images(images2)
            }
        } catch (error) {
            console.error('Failed to fetch journey photos:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-black text-white min-h-screen py-24 px-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9b896] mx-auto"></div>
                    <p className="mt-4 text-white/60">Loading gallery...</p>
                </div>
            </div>
        )
    }

    // Always show section, even if no images (for debugging and visibility)
    const hasImages = carousel1Images.length > 0 || carousel2Images.length > 0

    return (
         <div className="bg-black text-white min-h-screen py-24 px-6 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1400px]">
                 <motion.div 
                    className="mb-20 text-center space-y-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                 >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight">
                        Our Journey <span className="text-[#c9b896]">Together</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
                        Creating unforgettable memories with travelers from around the world
                    </p>
                </motion.div>
                
                {!hasImages && (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="max-w-2xl mx-auto">
                            <div className="mb-6 opacity-40">
                                <svg className="w-20 h-20 mx-auto text-[#c9b896]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-white/40 text-lg">
                                Journey photos will appear here once uploaded from the admin panel
                            </p>
                            <p className="text-white/20 text-sm mt-4">
                                Visit <span className="text-[#c9b896]">/admin/journey-photos</span> to add photos
                            </p>
                        </div>
                    </motion.div>
                )}
                
                {/* First Carousel */}
                {carousel1Images.length > 0 && (
                    <motion.div 
                        className="mb-12"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <PremiumPhotoCarousel images={carousel1Images} autoPlayDelay={6000} />
                    </motion.div>
                )}

                {/* Second Carousel */}
                {carousel2Images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <PremiumPhotoCarousel images={carousel2Images} autoPlayDelay={7000} />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
