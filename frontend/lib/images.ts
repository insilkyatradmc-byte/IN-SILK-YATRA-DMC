// Helper for image URLs and fallbacks
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'

// High quality Cloudinary images
export const FALLBACK_IMAGES: Record<string, string> = {
  'default': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop',
  
  // Cities & Places
  'Almaty': 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770901572/tom_aaa-kazakhstan-2726987_anijc6.jpg',
  'Almaty2': 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770901827/ira_b-mountains-4895894_i4qa2r.jpg',
  'Baku': 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770901574/maxxja-street-1997165_mawamg.jpg',
  'Baku2': 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770901827/alaakam-travel-2007903_pcrhdq.jpg',
  'Bishkek': 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770901827/makalu-kyrgyzstan-4770369_hwqduq.jpg',
  'Bishkek2': 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770901576/tomaspaint-mountains-7589046_j8gcew.jpg',
  'Tashkent': 'https://images.unsplash.com/photo-1655206103623-a2612cb7f58d?q=80&w=1000&auto=format&fit=crop',
  'Samarkand': 'https://images.unsplash.com/photo-1655206103623-a2612cb7f58d?q=80&w=1000&auto=format&fit=crop', 
  'Silk Road': 'https://images.unsplash.com/photo-1594183868285-d6ce74892cce?q=80&w=1000&auto=format&fit=crop', // Desert/Caravan feel
  'Kolsai': 'https://images.unsplash.com/photo-1551893132-4752b027c00e?q=80&w=1000&auto=format&fit=crop', // Lake
  'Charyn': 'https://images.unsplash.com/photo-1563829035-71761de6860d?q=80&w=1000&auto=format&fit=crop', // Canyon

  // Countries
  'Kazakhstan': 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770901827/ira_b-mountains-4895894_i4qa2r.jpg',
  'Kyrgyzstan': 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770901576/tomaspaint-mountains-7589046_j8gcew.jpg',
  'Azerbaijan': 'https://res.cloudinary.com/dzbk92wsh/image/upload/v1770901827/alaakam-travel-2007903_pcrhdq.jpg',
  'Uzbekistan': 'https://images.unsplash.com/photo-1655206103623-a2612cb7f58d?q=80&w=1000&auto=format&fit=crop',

  // Types
  'Nature': 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000',
  'Mountain': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000',
  'City': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1000',
  'Cultural': 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1000',
  'Lake': 'https://images.unsplash.com/photo-1497525867946-b844f77c8e9b?q=80&w=1000',
}

export const getFallbackImage = (query: string) => {
    const q = query.toLowerCase();
    
    // Priority specific matches
    if (q.includes('almaty')) return FALLBACK_IMAGES['Almaty'];
    if (q.includes('baku')) return FALLBACK_IMAGES['Baku'];
    if (q.includes('bishkek')) return FALLBACK_IMAGES['Bishkek'];
    if (q.includes('samarkand')) return FALLBACK_IMAGES['Samarkand'];
    if (q.includes('tashkent')) return FALLBACK_IMAGES['Tashkent'];
    if (q.includes('kolsai') || q.includes('kaindy')) return FALLBACK_IMAGES['Kolsai'];
    if (q.includes('charyn')) return FALLBACK_IMAGES['Charyn'];
    
    // Country matches
    if (q.includes('kazakhstan')) return FALLBACK_IMAGES['Kazakhstan'];
    if (q.includes('kyrgyzstan')) return FALLBACK_IMAGES['Kyrgyzstan'];
    if (q.includes('azerbaijan')) return FALLBACK_IMAGES['Azerbaijan'];
    if (q.includes('uzbekistan')) return FALLBACK_IMAGES['Uzbekistan'];
    
    // Theme matches
    if (q.includes('mountain') || q.includes('trek') || q.includes('peak')) return FALLBACK_IMAGES['Mountain'];
    if (q.includes('lake') || q.includes('water')) return FALLBACK_IMAGES['Lake'];
    if (q.includes('city') || q.includes('urban') || q.includes('tour')) return FALLBACK_IMAGES['City'];
    if (q.includes('culture') || q.includes('history') || q.includes('silk')) return FALLBACK_IMAGES['Silk Road'];
    
    return FALLBACK_IMAGES['default'];
}

export const getImageUrl = (path: string | undefined | null, query: string = '') => {
  // If no path, or path contains placeholder, or if we want to force fallback
  if (!path || path.includes('placeholder') || path.includes('default')  || !path.includes('/')) {
     return getFallbackImage(query);
  }
  
  // If it's a full URL, use it
  if (path.startsWith('http')) return path
  
  // If it's a local path from backend
  return `${API_BASE}${path}`
}
