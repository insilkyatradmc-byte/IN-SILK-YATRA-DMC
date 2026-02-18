'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InquiryPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulate clicking the REQUEST button in navbar
    // This page serves as a redirect to trigger the modal
    router.push('/');
    
    // Give a small delay for navigation, then trigger modal
    setTimeout(() => {
      // Dispatch a custom event to open the inquiry form
      window.dispatchEvent(new CustomEvent('openInquiryForm'));
    }, 100);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B8A078] mx-auto mb-4"></div>
        <p className="text-gray-600">Opening inquiry form...</p>
      </div>
    </div>
  );
}
