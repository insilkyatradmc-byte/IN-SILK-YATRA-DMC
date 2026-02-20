'use client';

import React, { useState, useEffect } from 'react';
import { inquiryFormSettingsAPI } from '@/lib/api';

interface InquiryFormData {
  // Step 1
  feelingDescription: string;
  
  // Step 2
  selectedDestination: string;
  
  // Step 3
  travelStartDate: string;
  travelEndDate: string;
  datesFlexible: boolean;
  
  // Step 4
  travelParty: string;
  
  // Step 5
  adultsCount: number;
  childrenCount: number;
  childrenAges: number[];
  
  // Step 6
  budgetAmount: string;
  budgetCurrency: string;
  
  // Step 7
  travelVibes: string[];
  specialOccasions: string[];
  
  // Step 8
  accommodationType: string;
  
  // Step 9
  privateTourThemes: string[];
  experienceStyles: string[];
  conciergeInterests: string[];
  transfersDrivers: string[];
  
  // Step 10
  name: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  additionalNotes: string;
  
  // Step 11
  discoverySource: string;
}

interface FormOptions {
  destinations: string[];
  travel_vibes: string[];
  special_occasions: string[];
  accommodation_types: string[];
  tour_themes: string[];
  experience_styles: string[];
  concierge_services: string[];
  transfers: string[];
  travel_party_options: string[];
  currencies: string[];
}

interface MultiStepInquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MultiStepInquiryForm({ isOpen, onClose }: MultiStepInquiryFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<InquiryFormData>({
    feelingDescription: '',
    selectedDestination: '',
    travelStartDate: '',
    travelEndDate: '',
    datesFlexible: false,
    travelParty: '',
    adultsCount: 1,
    childrenCount: 0,
    childrenAges: [],
    budgetAmount: '',
    budgetCurrency: 'Euro (EUR)',
    travelVibes: [],
    specialOccasions: [],
    accommodationType: '',
    privateTourThemes: [],
    experienceStyles: [],
    conciergeInterests: [],
    transfersDrivers: [],
    name: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    additionalNotes: '',
    discoverySource: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showChildren, setShowChildren] = useState(false);
  
  // Dynamic form options from backend with default values
  const [formOptions, setFormOptions] = useState<FormOptions>({
    destinations: ['Almaty, Kazakhstan', 'Bishkek, Kyrgyzstan', 'Baku, Azerbaijan'],
    travel_vibes: ['Adventure & Exploration', 'Cultural Immersion', 'Nature & Mountains', 'Relaxation & Wellness'],
    special_occasions: ['Honeymoon', 'Anniversary', 'Birthday Trip', 'Family Reunion', 'No Special Occasion'],
    accommodation_types: ['Boutique Hotels', 'Luxury Hotels', 'Traditional Guesthouses', 'Resorts'],
    tour_themes: ['Silk Road Heritage', 'Mountain Trekking', 'Nomadic Culture', 'Wildlife & Nature'],
    experience_styles: ['Private & Exclusive', 'Small Group', 'Fully Guided', 'Self-Guided'],
    concierge_services: ['Restaurant Reservations', 'Local Guide Services', 'Translation Services', 'Event Planning'],
    transfers: ['Airport Transfers', 'Full-Day Private Driver', 'Inter-City Transfers'],
    travel_party_options: ['Just me', 'With my partner', 'With my family', 'With friends', 'Other'],
    currencies: ['Tenge (KZT)', 'Euro (EUR)', 'Dollar (USD)', 'INR (₹)'],
  });
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Fetch form options from backend
  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        const response = await inquiryFormSettingsAPI.getAll();
        if (response.data.success && response.data.data) {
          // Merge fetched options with defaults to ensure all properties exist
          setFormOptions(prev => ({
            ...prev,
            ...response.data.data,
          }));
        }
      } catch (error) {
        console.error('Error fetching form options:', error);
        // Default values are already set in useState, no need to set again
      } finally {
        setLoadingOptions(false);
      }
    };

    if (isOpen) {
      fetchFormOptions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateFormData = (field: keyof InquiryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof InquiryFormData, item: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(item)) {
      updateFormData(field, currentArray.filter(i => i !== item));
    } else {
      updateFormData(field, [...currentArray, item]);
    }
  };

  const handleNext = () => {
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          feeling_description: formData.feelingDescription,
          selected_destination: formData.selectedDestination,
          travel_start_date: formData.travelStartDate,
          travel_end_date: formData.travelEndDate,
          dates_flexible: formData.datesFlexible,
          travel_party: formData.travelParty,
          adults_count: formData.adultsCount,
          children_count: formData.childrenCount,
          children_ages: formData.childrenAges,
          budget_amount: formData.budgetAmount ? parseFloat(formData.budgetAmount) : null,
          budget_currency: formData.budgetCurrency,
          travel_vibes: formData.travelVibes,
          special_occasions: formData.specialOccasions,
          accommodation_type: formData.accommodationType,
          private_tour_themes: formData.privateTourThemes,
          experience_styles: formData.experienceStyles,
          concierge_interests: formData.conciergeInterests,
          transfers_drivers: formData.transfersDrivers,
          additional_notes: formData.additionalNotes,
          discovery_source: formData.discoverySource,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-12 py-12 animate-fadeIn">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-serif text-[#1c1917] leading-tight">
                WHAT DOES YOUR<br/>SILK ROAD FEEL LIKE?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                Share the feeling that defines your Silk Road journey.
              </p>
              <p className="text-gray-500 max-w-2xl mx-auto text-base leading-relaxed font-light">
                Your dedicated travel designer will shape it into a journey attuned to your rhythm, your curiosity, and your sense of wonder.
              </p>
            </div>
              
            <button
              onClick={handleNext}
              className="mt-8 px-12 py-3 border-b-2 border-[#1c1917] hover:bg-gray-50 transition-all duration-300 font-sans tracking-[0.2em] text-sm uppercase"
            >
              CONTINUE
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8 py-8 animate-fadeIn">
            <h2 className="text-4xl font-serif text-center text-[#1c1917]">Where to?</h2>
            <div className="max-w-2xl mx-auto">
              <label className="block text-xs font-light mb-3 text-gray-500 text-center tracking-[0.3em] uppercase">
                Choose from our curated list <span className="text-[#c9b896]">*</span>
              </label>
              <select
                value={formData.selectedDestination}
                onChange={(e) => updateFormData('selectedDestination', e.target.value)}
                className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light text-lg text-center"
              >
                <option value="">Select destination</option>
                {(formOptions?.destinations || []).map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 py-8 animate-fadeIn">
            <h2 className="text-4xl font-serif text-center text-[#1c1917]">When?</h2>
            <div className="max-w-2xl mx-auto space-y-6">
              <label className="block text-xs font-light text-gray-500 text-center tracking-[0.3em] uppercase">
                Choose your exact dates <span className="text-[#c9b896]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-6">
                <input
                  type="date"
                  value={formData.travelStartDate}
                  onChange={(e) => updateFormData('travelStartDate', e.target.value)}
                  className="p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light"
                />
                <input
                  type="date"
                  value={formData.travelEndDate}
                  onChange={(e) => updateFormData('travelEndDate', e.target.value)}
                  className="p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light"
                />
              </div>
              <div className="flex items-center gap-3 justify-center pt-4">
                <input
                  type="checkbox"
                  id="flexible"
                  checked={formData.datesFlexible}
                  onChange={(e) => updateFormData('datesFlexible', e.target.checked)}
                  className="w-4 h-4 accent-[#c9b896]"
                />
                <label htmlFor="flexible" className="text-sm font-light text-gray-600">My dates are flexible</label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 py-8 animate-fadeIn">
            <h2 className="text-4xl font-serif text-center text-[#1c1917]">Who will be travelling?</h2>
            <div className="max-w-2xl mx-auto space-y-6">
              <label className="block text-xs font-light text-gray-500 text-center tracking-[0.3em] uppercase">
                Choose your travel party <span className="text-[#c9b896]">*</span>
              </label>
              <div className="space-y-3">
                {(formOptions?.travel_party_options || []).map((option) => (
                  <label key={option} className="flex items-center gap-4 p-5 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-all duration-300">
                    <input
                      type="radio"
                      name="travelParty"
                      value={option}
                      checked={formData.travelParty === option}
                      onChange={(e) => updateFormData('travelParty', e.target.value)}
                      className="w-4 h-4 accent-[#c9b896]"
                    />
                    <span className="font-light text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8 py-8 animate-fadeIn">
            <h2 className="text-4xl font-serif text-center text-[#1c1917]">How many travelers?</h2>
            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-center text-gray-500 font-light text-sm">
                Specify the number of travelers in your party.
              </p>
              
              <div>
                <label className="block text-xs font-light mb-3 text-gray-500 tracking-[0.3em] uppercase">
                  Adults <span className="text-[#c9b896]">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.adultsCount}
                  onChange={(e) => updateFormData('adultsCount', parseInt(e.target.value) || 1)}
                  placeholder="Number of adults"
                  className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light text-center"
                />
                <p className="text-xs text-gray-400 mt-2 text-center">(13+ years old)</p>
              </div>

              <div className="flex items-center gap-3 justify-center pt-4">
                <input
                  type="checkbox"
                  id="addChildren"
                  checked={showChildren}
                  onChange={(e) => {
                    setShowChildren(e.target.checked);
                    if (!e.target.checked) {
                      updateFormData('childrenCount', 0);
                      updateFormData('childrenAges', []);
                    }
                  }}
                  className="w-4 h-4 accent-[#c9b896]"
                />
                <label htmlFor="addChildren" className="text-sm font-light text-gray-600">Add children</label>
              </div>

              {showChildren && (
                <div className="animate-slideDown">
                  <label className="block text-xs font-light mb-3 text-gray-500 tracking-[0.3em] uppercase">
                    Number of children
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.childrenCount}
                    onChange={(e) => updateFormData('childrenCount', parseInt(e.target.value) || 0)}
                    placeholder="Number of children"
                    className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light text-center"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8 py-8 animate-fadeIn">
            <h2 className="text-4xl font-serif text-center text-[#1c1917]">
              What budget would you like to work with?
            </h2>
            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-center text-gray-500 font-light text-sm">
                Budget range (excluding flights)
              </p>
              
              <div>
                <label className="block text-xs font-light mb-3 text-gray-500 text-center tracking-[0.3em] uppercase">
                  Budget <span className="text-[#c9b896]">*</span>
                </label>
                <div className="flex gap-3 items-center justify-center">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={formData.budgetAmount}
                    onChange={(e) => updateFormData('budgetAmount', e.target.value)}
                    placeholder="8,000"
                    className="flex-1 max-w-xs p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light text-center text-lg"
                  />
                </div>

              <div className="mt-6">
                <label className="block text-xs font-light mb-3 text-gray-500 text-center tracking-[0.3em] uppercase">
                  Currency
                </label>
                <div className="flex flex-wrap gap-3 justify-center">
                  {(formOptions?.currencies || ['Tenge (KZT)', 'Euro (EUR)', 'Dollar (USD)', 'INR (₹)']).map((currency) => (
                    <button
                      key={currency}
                      type="button"
                      onClick={() => updateFormData('budgetCurrency', currency)}
                      className={`px-6 py-3 border-b-2 transition-all duration-300 font-light ${
                        formData.budgetCurrency === currency
                          ? 'bg-[#c9b896]/10 border-[#c9b896] text-[#1c1917]'
                          : 'border-gray-300 hover:border-[#c9b896] text-gray-600'
                      }`}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-8 py-8 animate-fadeIn">
            <h2 className="text-4xl font-serif text-center text-[#1c1917]">
              What defines your travel style?
            </h2>
            <div className="max-w-3xl mx-auto space-y-8">
              <p className="text-center text-gray-500 font-light text-sm">
                Choose what reflects your journey
              </p>
              
              <div>
                <h3 className="text-xs font-light mb-4 text-gray-500 tracking-[0.3em] uppercase text-center">Travel Vibes</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {(formOptions?.travel_vibes || []).map((vibe) => (
                    <button
                      key={vibe}
                      onClick={() => toggleArrayItem('travelVibes', vibe)}
                      className={`px-6 py-3 border-b-2 transition-all duration-300 font-light ${
                        formData.travelVibes.includes(vibe)
                          ? 'bg-[#c9b896]/10 border-[#c9b896] text-[#1c1917]'
                          : 'border-gray-300 hover:border-[#c9b896] text-gray-600'
                      }`}
                    >
                      {vibe}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-light mb-4 text-gray-500 tracking-[0.3em] uppercase text-center">Special Occasions</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {(formOptions?.special_occasions || []).map((occasion) => (
                    <button
                      key={occasion}
                      onClick={() => toggleArrayItem('specialOccasions', occasion)}
                      className={`px-6 py-3 border-b-2 transition-all duration-300 font-light ${
                        formData.specialOccasions.includes(occasion)
                          ? 'bg-[#c9b896]/10 border-[#c9b896] text-[#1c1917]'
                          : 'border-gray-300 hover:border-[#c9b896] text-gray-600'
                      }`}
                    >
                      {occasion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-center">
              WHAT FEELS LIKE THE RIGHT PLACE TO STAY?
            </h2>
            <div className="max-w-2xl mx-auto">
              <label className="block text-sm font-medium mb-2 text-[#1c1917] font-sans tracking-wider">
                CHOOSE YOUR ACCOMMODATION <span className="text-[#c9b896]">*</span>
              </label>
              <select
                value={formData.accommodationType}
                onChange={(e) => updateFormData('accommodationType', e.target.value)}
                className="w-full p-3 border border-[#c9b896]/30 bg-white focus:border-[#c9b896] focus:ring-2 focus:ring-[#c9b896]/20 outline-none transition-all font-sans"
              >
                <option value="">Select</option>
                {(formOptions?.accommodation_types || []).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-8 py-8 animate-fadeIn">
            <h2 className="text-4xl font-serif text-center text-[#1c1917]">
              How would you like to elevate your trip?
            </h2>
            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-center text-gray-500 font-light text-sm">
                Select what you'd like to include in your journey — everything is optional.
              </p>
              
              <div>
                <label className="block text-xs font-light mb-3 text-gray-500 tracking-[0.3em] uppercase">
                  Private Tour Themes
                </label>
                <select
                  value={formData.privateTourThemes[0] || ''}
                  onChange={(e) => updateFormData('privateTourThemes', [e.target.value])}
                  className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light"
                >
                  <option value="">Select theme</option>
                  {(formOptions?.tour_themes || []).map((theme) => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-light mb-3 text-gray-500 tracking-[0.3em] uppercase">
                  Experience Styles
                </label>
                <select
                  value={formData.experienceStyles[0] || ''}
                  onChange={(e) => updateFormData('experienceStyles', [e.target.value])}
                  className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light"
                >
                  <option value="">Select style</option>
                  {(formOptions?.experience_styles || []).map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-light mb-3 text-gray-500 tracking-[0.3em] uppercase">
                  Concierge Services
                </label>
                <select
                  value={formData.conciergeInterests[0] || ''}
                  onChange={(e) => updateFormData('conciergeInterests', [e.target.value])}
                  className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light"
                >
                  <option value="">Select service</option>
                  {(formOptions?.concierge_services || []).map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-light mb-3 text-gray-500 tracking-[0.3em] uppercase">
                  Transfers & Private Drivers
                </label>
                <select
                  value={formData.transfersDrivers[0] || ''}
                  onChange={(e) => updateFormData('transfersDrivers', [e.target.value])}
                  className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light"
                >
                  <option value="">Select option</option>
                  {(formOptions?.transfers || []).map((transfer) => (
                    <option key={transfer} value={transfer}>{transfer}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-8 py-8 animate-fadeIn">
            <h2 className="text-4xl font-serif text-center text-[#1c1917]">Your details</h2>
            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-center text-gray-500 font-light text-sm">
                Your contact details for next steps.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-light mb-3 text-gray-500 tracking-[0.3em] uppercase">
                    First Name <span className="text-[#c9b896]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-light mb-3 text-gray-500 tracking-[0.3em] uppercase">
                    Last Name <span className="text-[#c9b896]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-light mb-3 text-gray-500 tracking-[0.3em] uppercase">
                    Phone Number <span className="text-[#c9b896]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-light mb-3 text-gray-500 tracking-[0.3em] uppercase">
                    Email <span className="text-[#c9b896]">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-light mb-3 text-gray-500 tracking-[0.3em] uppercase">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateFormData('country', e.target.value)}
                  className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 font-light"
                />
              </div>

              <div>
                <label className="block text-xs font-light mb-3 text-gray-500 tracking-[0.3em] uppercase">Additional Notes</label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                  rows={4}
                  className="w-full p-4 border-b-2 border-gray-300 bg-transparent focus:border-[#c9b896] outline-none transition-all duration-300 resize-none font-light"
                  placeholder="Any special requests or preferences..."
                />
              </div>

              <div className="flex items-start gap-3 mt-8 p-4 bg-gray-50 rounded">
                <input type="checkbox" className="mt-1 w-4 h-4 accent-[#c9b896]" required />
                <label className="text-xs text-gray-600 font-light leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-[#c9b896] underline hover:text-[#b8a685]">Terms of Use</a>,{' '}
                  <a href="#" className="text-[#c9b896] underline hover:text-[#b8a685]">Privacy Policy</a> and{' '}
                  <a href="#" className="text-[#c9b896] underline hover:text-[#b8a685]">Cookie Policy</a>.{' '}
                  <span className="text-[#c9b896]">*</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 11:
        return (
          <div className="text-center space-y-6 animate-fadeIn">
            {!submitSuccess ? (
              <>
                <div className="space-y-4">
                  <img 
                    src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770101106/file_0000000073e87208b9708e744f83bf52_gx37wu.png"
                    alt="IN-SILK YATRA"
                    className="h-16 w-auto mx-auto"
                  />
                  <div className="text-xs tracking-[0.3em] text-gray-500 uppercase">
                    Silk Road Travel Redefined
                  </div>
                </div>
                
                <div className="space-y-4 max-w-2xl mx-auto">
                  <p className="text-gray-600 text-base leading-relaxed">
                    Everything you've shared brings us to this moment — the beginning of defining your Silk Road journey.
                  </p>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Your travel designer will now transform these choices into a curated, meaningful itinerary shaped around who you are and how you travel.
                  </p>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Submit your request, and we'll connect with you to begin crafting your journey together.
                  </p>
                  
                  <div className="text-5xl font-serif text-[#c9b896] my-10 leading-tight">
                    thank you
                  </div>
                  
                  <div className="space-y-6 pt-4">
                    <p className="text-sm font-light text-gray-600">Before we move forward, how did you discover us?</p>
                    
                    <div className="flex flex-wrap gap-3 justify-center">
                      {['Referral', 'Travel Agent', 'Google Search', 'Online Ads', 'Newsletter', 'Social Media', 'Other'].map((source) => (
                        <label key={source} className="flex items-center gap-3 cursor-pointer px-4 py-2 border-b border-gray-200 hover:bg-gray-50 transition-all duration-300">
                          <input
                            type="radio"
                            name="discoverySource"
                            value={source}
                            checked={formData.discoverySource === source}
                            onChange={(e) => updateFormData('discoverySource', e.target.value)}
                            className="w-4 h-4 accent-[#c9b896]"
                          />
                          <span className="text-sm font-light">{source}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="mt-10 px-16 py-4 border-b-2 border-[#1c1917] hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed tracking-[0.2em] text-sm uppercase"
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <img 
                  src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770101106/file_0000000073e87208b9708e744f83bf52_gx37wu.png"
                  alt="IN-SILK YATRA"
                  className="h-16 w-auto mx-auto"
                />
                <div className="text-3xl font-serif text-[#1c1917]">Thank You!</div>
                <p className="text-gray-600 max-w-xl mx-auto text-base leading-relaxed">
                  Your inquiry has been submitted successfully. One of our travel designers will be in touch with you shortly to begin creating your perfect Silk Road journey.
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 px-12 py-3 bg-[#c9b896] text-white hover:bg-[#b8a685] transition-all duration-300 rounded"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200">
          {/* Step Indicator - Top Left */}
          <div className="absolute left-6 top-6">
            <div className="w-12 h-12 rounded-full bg-[#c9b896] text-white flex items-center justify-center text-lg font-serif shadow-md">
              {currentStep}
            </div>
          </div>
          
          {/* Logo - Centered */}
          <div className="flex justify-center">
            <img 
              src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770101106/file_0000000073e87208b9708e744f83bf52_gx37wu.png"
              alt="IN-SILK YATRA"
              className="h-14 w-auto"
            />
          </div>
          
          {/* Close Button - Top Right */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-[#1c1917]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="max-w-3xl mx-auto">
            {renderStep()}
          </div>
        </div>

        {/* Footer */}
        {currentStep > 1 && currentStep < 11 && (
          <div className="border-t border-gray-200 p-6 bg-white">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <button
                onClick={handleBack}
                className="px-8 py-2 text-gray-600 hover:text-[#c9b896] transition-all duration-200 font-sans tracking-wider text-sm"
              >
                BACK
              </button>
              
              <div className="hidden md:block text-[#c9b896] text-sm font-light">+7 707 422 7482</div>
              
              <button
                onClick={handleNext}
                className="px-8 py-2 border-b-2 border-[#c9b896] hover:bg-[#c9b896]/10 transition-all duration-200 font-sans tracking-wider text-sm"
              >
                NEXT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
