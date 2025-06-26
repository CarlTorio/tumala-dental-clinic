
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, ClockIcon, PhoneIcon, MailIcon, MapPinIcon } from 'lucide-react';
import BookingModal from '@/components/BookingModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DentistLogin from '@/components/DentistLogin';

const Index = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const services = [{
    title: "General Dentistry",
    description: "Comprehensive oral health care including cleanings, fillings, and preventive treatments.",
    icon: "🦷"
  }, {
    title: "Cosmetic Dentistry",
    description: "Enhance your smile with veneers, whitening, and aesthetic dental procedures.",
    icon: "✨"
  }, {
    title: "Orthodontics",
    description: "Straighten your teeth with braces, clear aligners, and orthodontic treatments.",
    icon: "🦷"
  }, {
    title: "Emergency Care",
    description: "Immediate dental care for urgent situations and dental emergencies.",
    icon: "🚨"
  }];

  return <div className="min-h-screen bg-white">
      <Header onBookNow={() => setIsBookingOpen(true)} />
      
      {/* Hero Section */}
      <section className="relative dental-gradient text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Your Perfect Smile Starts Here
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">Looking for a gentle &amp; effective dental experience? Don't hesitate to visit us. We're committed to providing you with healthy, confident smile.</p>
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-300" onClick={() => setIsBookingOpen(true)}>
            <CalendarIcon className="mr-2 h-5 w-5" />
            Book Your Appointment
          </Button>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 px-4 dental-light-bg">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://drive.google.com/file/d/1S6yFZ7XhkrOEOi0R8hBeKmra8wQVbdkH/preview?autoplay=1&loop=1&mute=1&controls=0"
                className="w-full h-64 md:h-96"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                title="Tumala Dental Clinic Video"
                style={{ aspectRatio: '16/9' }}
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-area" className="py-16 px-4 dental-light-bg">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive dental care tailored to your needs, delivered with the latest technology and gentle care.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{service.icon}</div>
                  <CardTitle className="text-primary">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{service.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* About Section (Clinic Information) */}
      <section id="about-area" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary mb-6">Visit Our Modern Clinic</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPinIcon className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Location</h3>
                    <p className="text-gray-600">4009-A Richtofen St. Hensonville,<br />Brgy. Malabanias, Angeles City, Pampanga</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <ClockIcon className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Office Hours</h3>
                    <div className="text-gray-600">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 3:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <PhoneIcon className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Contact</h3>
                    <p className="text-gray-600">
                      Office: +63 999 464 8865<br />
                      Email: tumaladentalclinic@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPinIcon className="h-12 w-12 mx-auto mb-2" />
                <p>Interactive Google Maps</p>
                <p className="text-sm">(Map integration placeholder)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section (Final CTA) */}
      <section id="contact-area" className="py-16 px-4 dental-gradient text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Schedule Your Visit?</h2>
          <p className="text-xl mb-8 opacity-90">
            Take the first step towards a healthier, more beautiful smile today.
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4 rounded-full" onClick={() => setIsBookingOpen(true)}>
            <CalendarIcon className="mr-2 h-5 w-5" />
            Book Now - It's Easy!
          </Button>
        </div>
      </section>

      {/* Dentist Login Section */}
      <section className="py-8 px-4 bg-gray-50 border-t">
        <div className="container mx-auto text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Healthcare Professional Access</h3>
          <DentistLogin />
        </div>
      </section>

      <Footer />
      
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>;
};

export default Index;
