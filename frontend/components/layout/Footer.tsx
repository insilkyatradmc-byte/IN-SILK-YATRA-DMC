import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left Section - Logo and Social */}
          <div className="md:col-span-4 space-y-8">
            <div>
              <Link href="/" className="inline-block">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://res.cloudinary.com/dzbk92wsh/image/upload/v1770101106/file_0000000073e87208b9708e744f83bf52_gx37wu.png" 
                    alt="IN-SILK YATRA DMC" 
                    className="h-16 w-auto brightness-110"
                  />
                  <div>
                    <h3 className="text-2xl font-serif font-light tracking-wide">IN-SILK YATRA</h3>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-sans">DMC</p>
                  </div>
                </div>
              </Link>
            </div>

            <div>
              <p className="text-sm font-light mb-6">Explore Central Asia. Travel With Purpose.</p>
              
              <div className="space-y-1 text-sm">
                <p className="uppercase tracking-wider text-gray-400 text-xs mb-3">BASED IN ALMATY</p>
                <p className="font-light">EXPLORING KAZAKHSTAN</p>
                <p className="text-gray-400 mt-4">T. +7 707 422 7482</p>
                <p className="text-gray-400">E. insilkyatradmc@gmail.com</p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">Connect with us</p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/insilkyatradmc/" target="_blank" rel="noopener noreferrer" className="text-[#c4a676] hover:text-white transition-colors text-sm">
                  Instagram
                </a>
                <a href="https://www.facebook.com/share/1AgXykrVHo/" target="_blank" rel="noopener noreferrer" className="text-[#c4a676] hover:text-white transition-colors text-sm">
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Right Section - Links */}
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 md:ml-auto">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#c4a676] mb-4">THE COMPANY</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-white hover:text-[#c4a676] transition-colors font-light">
                    About IN-SILK YATRA
                  </Link>
                </li>
                <li>
                  <Link href="/destinations" className="text-white hover:text-[#c4a676] transition-colors font-light">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link href="/tours" className="text-white hover:text-[#c4a676] transition-colors font-light">
                    Tours
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white hover:text-[#c4a676] transition-colors font-light">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#c4a676] mb-4">OUR SERVICES</h4>
              <ul className="space-y-2">
                <li className="text-white font-light">Custom Tour Packages</li>
                <li className="text-white font-light">Private Transfers</li>
                <li className="text-white font-light">Cultural Experiences</li>
                <li className="text-white font-light">Adventure Tours</li>
                <li className="text-white font-light">Multi-Day Expeditions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>©{new Date().getFullYear()}. IN-SILK YATRA DMC. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">
                Terms and Conditions
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
