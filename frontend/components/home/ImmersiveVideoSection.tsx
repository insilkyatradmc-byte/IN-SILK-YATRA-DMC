'use client';

import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

export default function ImmersiveVideoSection() {
  const videoSrc = "https://res.cloudinary.com/dzbk92wsh/video/upload/v1770811351/40704-426189550_medium_g8jysi.mp4";

  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc={videoSrc}
      title="COSMIC JOURNEY"
      date="Experience Silk Road"
      scrollToExpand="SCROLL TO EXPAND"
      textBlend={true}
    >
      <div className="max-w-4xl mx-auto text-center text-white">
        <h3 className="text-3xl font-serif mb-6">A Journey Beyond Boundaries</h3>
        <p className="text-lg leading-relaxed opacity-90 max-w-2xl mx-auto">
          Embark on an immersive exploration where ancient traditions meet modern luxury. 
          Let the visuals guide you through landscapes untouched by time, revealing the soul of the Silk Road.
        </p>
      </div>
    </ScrollExpandMedia>
  );
}
