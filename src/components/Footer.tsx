
import React from 'react';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon, Facebook } from 'lucide-react';
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
              <span className="text-lg font-bold">Tumala Dental Clinic</span>
            </div>
            <p className="text-gray-400 mb-4">Healthy teeth, Happy life! 
We love helping you to achieve a bright and confident smile every day. </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61573834983240" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span>Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                
                <span className="md:hidden">IG</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                
                <span className="md:hidden">G</span>
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
                <span className="text-gray-400">09994648856</span>
              </div>
              <div className="flex items-center space-x-2">
                <MailIcon className="h-5 w-5 text-primary" />
                <span className="text-gray-400">tumaladentalclinic@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Clinic Hours</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>1:00 PM - 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                
                
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center space-x-2 text-red-400">
                  <PhoneIcon className="h-4 w-4" />
                  <span className="text-sm">Emergency: 09994648856</span>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <div className="space-y-3 text-gray-400">
              <div>
                <div className="font-medium text-white">General Dentistry</div>
                <div className="text-sm">Comprehensive oral health care and routine checkups</div>
              </div>
              <div>
                <div className="font-medium text-white">TMJ Practitioner</div>
                <div className="text-sm">Treatment for jaw joint disorders and pain relief</div>
              </div>
              <div>
                <div className="font-medium text-white">Orthodontics</div>
                <div className="text-sm">Teeth alignment and bite correction solutions</div>
              </div>
              <div>
                <div className="font-medium text-white">Pediatric Dentistry</div>
                <div className="text-sm">Specialized dental care for children and teens</div>
              </div>
              <div>
                <div className="font-medium text-white">Radiograph (XRAY)</div>
                <div className="text-sm">Digital imaging for accurate diagnosis</div>
              </div>
              <div>
                <div className="font-medium text-white">Prosthodontics</div>
                <div className="text-sm">Replacement of missing teeth with implants and dentures</div>
              </div>
              <div>
                <div className="font-medium text-white">Esthetics</div>
                <div className="text-sm">Cosmetic treatments for a beautiful smile</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 TumalaDentalClinic . All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;
