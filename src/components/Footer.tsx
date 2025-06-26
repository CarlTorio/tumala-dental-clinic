import React from 'react';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Practice Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🦷</span>
              </div>
              <span className="text-lg font-bold">DentalCare Plus</span>
            </div>
            <p className="text-gray-400 mb-4">
              Providing exceptional dental care with compassion and the latest technology for over 15 years.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Google
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPinIcon className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-gray-400">
                  <p>4009-A Richtofen St. Hensonville,
Brgy. Malabanias, Angeles City, Pampanga</p>
                  
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-primary" />
                <span className="text-gray-400">+63 999 464 8865</span>
              </div>
              <div className="flex items-center space-x-2">
                <MailIcon className="h-5 w-5 text-primary" />
                <span className="text-gray-400">info@dentalcareplus.com</span>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Office Hours</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 AM - 3:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center space-x-2 text-red-400">
                  <PhoneIcon className="h-4 w-4" />
                  <span className="text-sm">Emergency: (555) 911-CARE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>General Dentistry</li>
              <li>Cosmetic Dentistry</li>
              <li>Orthodontics</li>
              <li>Emergency Care</li>
              <li>Pediatric Dentistry</li>
              <li>Oral Surgery</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 DentalCare Plus. All rights reserved. | HIPAA Compliant | SSL Secured</p>
        </div>
      </div>
    </footer>;
};
export default Footer;