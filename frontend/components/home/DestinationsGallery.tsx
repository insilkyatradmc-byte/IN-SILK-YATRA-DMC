'use client'

import React, { useState, useEffect } from 'react'
import { CircularGallery, GalleryItem } from '@/components/ui/circular-gallery'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

const galleryData: GalleryItem[] = [
  {
    title: 'Almaty City',
    subtitle: 'Autumn Views, Kazakhstan',
    photo: {
      url: 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771595975/some-autumn-views-of-almaty-city-v0-9j3t78sn981e1_igfg1q.jpg',
      text: 'Beautiful autumn views of Almaty',
      pos: '50% 50%',
      by: 'IN-SILK YATRA'
    }
  },
  {
    title: 'Charyn Canyon',
    subtitle: 'Almaty Region, Kazakhstan',
    photo: {
      url: 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771515855/andy_bay-canyon-1740973_refb2k.jpg',
      text: 'Charyn Canyon dramatic landscape',
      pos: '50% 45%',
      by: 'Andy Bay'
    }
  },
  {
    title: 'Kolsay Lake',
    subtitle: 'Tien Shan, Kazakhstan',
    photo: {
      url: 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771595311/kolsay-lake-1-credit-to-rachita-saxena_bfefxq.jpg',
      text: 'Crystal clear alpine lake',
      pos: '50% 50%',
      by: 'Rachita Saxena'
    }
  },
  {
    title: 'Khan Tengri Park',
    subtitle: 'Tien Shan, Kazakhstan',
    photo: {
      url: 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771595509/Alpine_meadows_and_snow-covered_peaks_in_Khan_Tengri_Nature_Park__Tien_Shan_1_fekbui.jpg',
      text: 'Alpine meadows and snow peaks',
      pos: '50% 45%',
      by: 'IN-SILK YATRA'
    }
  },
  {
    title: 'Tien Shan Mountains',
    subtitle: 'Kazakhstan',
    photo: {
      url: 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770881292/andy_bay-mountains-8446221_ihswhz.jpg',
      text: 'Majestic mountain range',
      pos: '50% 40%',
      by: 'Andy Bay'
    }
  },
  {
    title: 'Medeu Valley',
    subtitle: 'Almaty, Kazakhstan',
    photo: {
      url: 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771595312/visitalmatykz-visitalmaty-3457149_e5xwdy.jpg',
      text: 'Mountain resort area',
      pos: '50% 50%',
      by: 'Visit Almaty'
    }
  },
  {
    title: 'Traditional Architecture',
    subtitle: 'Kazakhstan',
    photo: {
      url: 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771515856/milapom-kazakhstan-5434504_qa8ien.jpg',
      text: 'Historic Kazakh architecture',
      pos: '50% 45%',
      by: 'Milapom'
    }
  },
  {
    title: 'Mountain Landscape',
    subtitle: 'Central Kazakhstan',
    photo: {
      url: 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770901827/ira_b-mountains-4895894_i4qa2r.jpg',
      text: 'Pristine mountain scenery',
      pos: '50% 50%',
      by: 'Ira B'
    }
  },
  {
    title: 'Historic Landmark',
    subtitle: 'Kazakhstan',
    photo: {
      url: 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770901572/tom_aaa-kazakhstan-2726987_anijc6.jpg',
      text: 'Cultural heritage site',
      pos: '50% 45%',
      by: 'Tom AAA'
    }
  },
  {
    title: 'Urban Architecture',
    subtitle: 'Kazakhstan',
    photo: {
      url: 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770881291/bahonya-buildings-6282097_thp5xq.jpg',
      text: 'Modern Kazakh buildings',
      pos: '50% 50%',
      by: 'Bahonya'
    }
  },
  {
    title: 'Scenic Destination',
    subtitle: 'Kazakhstan',
    photo: {
      url: 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771664152/insilk_yatra/destinations/rcaemudbjocefft28tto.jpg',
      text: 'Beautiful travel destination',
      pos: '50% 50%',
      by: 'IN-SILK YATRA'
    }
  },
  {
    title: 'Natural Wonder',
    subtitle: 'Kazakhstan',
    photo: {
      url: 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1771663891/insilk_yatra/destinations/mekas76fngagf661ph9f.jpg',
      text: 'Stunning natural landscape',
      pos: '50% 50%',
      by: 'IN-SILK YATRA'
    }
  },
];

const DestinationsGallery = () => {
  const [radius, setRadius] = useState(650); // Default for desktop

  useEffect(() => {
    // Set initial radius based on window width
    const updateRadius = () => {
      if (window.innerWidth < 640) {
        setRadius(450); // Much larger radius for mobile to prevent overlap
      } else if (window.innerWidth < 1024) {
        setRadius(550); // Larger for tablet
      } else {
        setRadius(700); // Desktop radius
      }
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  return (
    <div className="w-full bg-black text-white relative overflow-hidden" style={{ minHeight: '200vh' }}>
      {/* Sticky container */}
      <div className="w-full h-screen sticky top-0 flex flex-col overflow-hidden">
        {/* Header Section - Fixed at absolute top */}
        <div className="text-center relative top-0 left-0 right-0 z-50 px-4 py-6 md:py-8 bg-gradient-to-b from-black via-black/90 to-transparent">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-[#c9b896]/10 text-[#c9b896] border-[#c9b896]/20 hover:bg-[#c9b896]/20 mb-3">
              Explore Our Destinations
            </Badge>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl lg:text-4xl font-serif font-light tracking-tight text-white mb-2"
          >
            Journey Through <span className="text-[#c9b896]">Central Asia</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xs md:text-sm text-white/60 max-w-2xl mx-auto px-4"
          >
            Scroll to explore breathtaking destinations across the ancient Silk Road
          </motion.p>
        </div>

        {/* Gallery Container with responsive radius */}
        <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
          <CircularGallery 
            items={galleryData} 
            radius={radius}
            autoRotateSpeed={0.01}
          />
        </div>
      </div>
    </div>
  );
};

export default DestinationsGallery;
