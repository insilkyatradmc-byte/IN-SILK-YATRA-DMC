'use client';

import React, { useState, useEffect } from 'react';
import { inquiryFormSettingsAPI } from '@/lib/api';

interface SimpleInquiryFormData {
  name: string;
  email: string;
  phone: string;
  travel_start_date: string;
  adults_count: string;
  selected_destination: string;
}

interface SimpleInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimpleInquiryModal({ isOpen, onClose }: SimpleInquiryModalProps) {
  const [formData, setFormData] = useState<SimpleInquiryFormData>({
    name: '',
    email: '',
    phone: '',
    travel_start_date: '',
    adults_count: '',
    selected_destination: '',
  });

  const [destinations, setDestinations] = useState<string[]>([
    'Almaty, Kazakhstan',
    'Bishkek, Kyrgyzstan',
    'Baku, Azerbaijan',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<SimpleInquiryFormData>>({});

  useEffect(() => {
    // Fetch destinations from backend
    const fetchDestinations = async () => {
      try {
        const response = await inquiryFormSettingsAPI.getAll();
        if (response.data.success && response.data.data?.destinations) {
          setDestinations(response.data.data.destinations);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    if (isOpen) {
      fetchDestinations();
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isSubmitting) {
          onClose();
        }
      };
      window.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleEscape);
      };
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof SimpleInquiryFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<SimpleInquiryFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email is optional, but if provided, validate format
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    }

    if (!formData.travel_start_date) {
      newErrors.travel_start_date = 'Date is required';
    }

    if (!formData.selected_destination) {
      newErrors.selected_destination = 'Destination is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          travel_start_date: formData.travel_start_date,
          adults_count: parseInt(formData.adults_count) || 1,
          selected_destination: formData.selected_destination,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitSuccess(true);
        // Reset form and close modal after 2 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            travel_start_date: '',
            adults_count: '',
            selected_destination: '',
          });
          setSubmitSuccess(false);
          onClose();
        }, 2000);
      } else {
        alert('Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Success View
  if (submitSuccess) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-6 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#B8A078] to-[#8B7355] rounded-full mx-auto flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-serif text-gray-900">Thank You!</h2>
          <p className="text-gray-600">
            Your inquiry has been submitted successfully. Our travel designer will contact you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with logo and close button */}
        <div className="relative border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="text-center">
              <img
                src="/logo.png"
                alt="IN SILK YATRA"
                className="h-10 mx-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
          <button
            onClick={handleClose}
            className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8">
          <div className="text-center mb-6 space-y-2">
            <h2 className="text-2xl md:text-3xl font-serif text-gray-900 tracking-tight">
              Plan Your Journey
            </h2>
            <p className="text-sm text-gray-600 max-w-xl mx-auto font-light">
              Share your travel details and our travel designer will craft a personalized experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                  Name<span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full px-3 py-2.5 bg-gray-50 border ${
                    errors.name ? 'border-rose-500' : 'border-gray-200'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8A078] focus:border-transparent transition-all`}
                />
                {errors.name && <p className="text-sm text-rose-500">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8A078] focus:border-transparent transition-all"
                />
              </div>

              {/* Mobile Field */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                  Mobile<span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className={`w-full px-3 py-2.5 bg-gray-50 border ${
                    errors.phone ? 'border-rose-500' : 'border-gray-200'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8A078] focus:border-transparent transition-all`}
                />
                {errors.phone && <p className="text-sm text-rose-500">{errors.phone}</p>}
              </div>

              {/* Date Field */}
              <div className="space-y-1.5">
                <label htmlFor="travel_start_date" className="block text-sm font-medium text-gray-900">
                  Date<span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  id="travel_start_date"
                  name="travel_start_date"
                  value={formData.travel_start_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2.5 bg-gray-50 border ${
                    errors.travel_start_date ? 'border-rose-500' : 'border-gray-200'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8A078] focus:border-transparent transition-all`}
                />
                {errors.travel_start_date && <p className="text-sm text-rose-500">{errors.travel_start_date}</p>}
              </div>

              {/* No of Travellers Field */}
              <div className="space-y-1.5">
                <label htmlFor="adults_count" className="block text-sm font-medium text-gray-900">
                  No of travellers
                </label>
                <input
                  type="number"
                  id="adults_count"
                  name="adults_count"
                  value={formData.adults_count}
                  onChange={handleChange}
                  placeholder="Enter number"
                  min="1"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8A078] focus:border-transparent transition-all"
                />
              </div>

              {/* Destination Field */}
              <div className="space-y-1.5">
                <label htmlFor="selected_destination" className="block text-sm font-medium text-gray-900">
                  Destination<span className="text-rose-500">*</span>
                </label>
                <select
                  id="selected_destination"
                  name="selected_destination"
                  value={formData.selected_destination}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 bg-gray-50 border ${
                    errors.selected_destination ? 'border-rose-500' : 'border-gray-200'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8A078] focus:border-transparent transition-all appearance-none cursor-pointer`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5rem',
                  }}
                >
                  <option value="">Select destination</option>
                  {destinations.map((dest, index) => (
                    <option key={index} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
                {errors.selected_destination && <p className="text-sm text-rose-500">{errors.selected_destination}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#B8A078] text-white py-3 rounded-full hover:bg-[#8B7355] transition-all duration-300 font-medium text-base shadow-md hover:shadow-lg transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Enquiry'
                )}
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-4">
            By submitting this form, you agree to our privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}
