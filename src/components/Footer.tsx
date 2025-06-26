
import React from 'react';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Main clinic branding - centered */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🦷</span>
            </div>
            <span className="text-2xl font-bold">Tumala Dental Clinic</span>
          </div>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Healthy teeth, Happy life! We love helping you to achieve a bright and confident smile every day.
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://www.facebook.com/profile.php?id=61573834983240" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span>Facebook</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Google
            </a>
          </div>
        </div>

        {/* Main content sections - centered */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Contact Us */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex flex-col items-center space-y-2">
                <MapPinIcon className="h-5 w-5 text-primary" />
                <div className="text-gray-400 text-sm">
                  <p>4009-A Richtofen St. Hensonville,</p>
                  <p>Brgy. Malabanias, Angeles City, Pampanga</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <PhoneIcon className="h-5 w-5 text-primary" />
                <span className="text-gray-400">09994648856</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <MailIcon className="h-5 w-5 text-primary" />
                <span className="text-gray-400 text-sm">tumaladentalclinic@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Clinic Hours */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Clinic Hours</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex flex-col">
                <span className="font-medium">Monday - Friday</span>
                <span>9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Saturday - Sunday</span>
                <span>9:00 AM - 7:00 PM</span>
              </div>
              <div className="pt-2 mt-4 border-t border-gray-700">
                <div className="flex flex-col items-center space-y-2 text-red-400">
                  <PhoneIcon className="h-4 w-4" />
                  <span className="text-sm">Emergency: 09994648856</span>
                </div>
              </div>
            </div>
          </div>

          {/* Our Services */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>General Dentistry</li>
              <li>TMJ Practitioner</li>
              <li>Orthodontics</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 DentalCare Plus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
