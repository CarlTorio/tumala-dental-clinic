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
  const [isButtonHighlighted, setIsButtonHighlighted] = useState(false);
  const handleBookingClick = () => {
    setIsButtonHighlighted(true);
    setIsBookingOpen(true);

    // Remove highlight after animation
    setTimeout(() => {
      setIsButtonHighlighted(false);
    }, 400);
  };
  const handleMapClick = () => {
    window.open('https://maps.app.goo.gl/Mnej5iLxeQNfKZur7', '_blank');
  };
  const services = [{
    title: "General Dentistry",
    description: "Comprehensive oral health care including cleanings, fillings, and preventive treatments.",
    icon: "🦷"
  }, {
    title: "Orthodontics",
    description: "Straighten your teeth with braces, clear aligners, and orthodontic treatments.",
    icon: "🦷"
  }, {
    title: "TMJ-Practitioner",
    description: "Specialized treatment for temporomandibular joint disorders, jaw pain, and bite alignment issues.",
    icon: "🔧"
  }];
  return <div className="min-h-screen bg-white">
      <Header onBookNow={handleBookingClick} />
      
      {/* Hero Section */}
      <section className="relative dental-gradient text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in md:text-5xl">
            Your Perfect Smile Starts Here
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">Looking for a gentle &amp; effective dental experience? Don't hesitate to visit us. We're committed to providing you with healthy, confident smile.</p>
          <div className="relative inline-block">
            <Button size="lg" className={`bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-700 animate-zoom-gentle ${isButtonHighlighted ? 'ring-4 ring-blue-300 ring-opacity-75 shadow-lg scale-110' : ''}`} onClick={handleBookingClick}>
              <CalendarIcon className="mr-2 h-5 w-5" />
              Book Your Appointment
            </Button>
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-white text-sm animate-pulse-gentle">
              👆 Click here
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 px-4 dental-light-bg">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-lg overflow-hidden shadow-lg relative" style={{
            paddingTop: '56.25%'
          }}>
              <iframe src="https://www.youtube.com/embed/vkijaBkDdJM?autoplay=1&mute=1&loop=1&playlist=vkijaBkDdJM&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1&vq=hd1080&title=0&byline=0&portrait=0&branding=0&autohide=1&theme=light&color=white&start=0&end=0" className="absolute top-0 left-0 w-full h-full" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen title="Tumala Dental Clinic Video" style={{
              aspectRatio: '16/9',
              objectFit: 'cover'
            }}></iframe>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday- Sunday: 9:00 AM - 7:00 PM</p>
                      
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <PhoneIcon className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Contact</h3>
                    <p className="text-gray-600">
                      Clinic: 09994648856<br />
                      Email: tumaladentalclinic@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300" onClick={handleMapClick}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3845.8847742562577!2d120.58825897589!3d15.155638985276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f27a7b5c7b7b%3A0x8b8b8b8b8b8b8b8b!2s4009-A%20Richtofen%20St%2C%20Angeles%2C%20Pampanga%2C%20Philippines!5e0!3m2!1sen!2sph!4v1640995200000!5m2!1sen!2sph" width="100%" height="384" style={{
              border: 0
            }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Tumala Dental Clinic Location" className="pointer-events-none" />
              <div className="absolute inset-0 bg-transparent hover:bg-blue-500 hover:bg-opacity-10 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <MapPinIcon className="h-5 w-5 text-primary inline mr-2" />
                  <span className="text-sm font-medium text-primary">Click to open in Google Maps</span>
                </div>
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
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4 rounded-full animate-zoom-gentle" onClick={handleBookingClick}>
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
