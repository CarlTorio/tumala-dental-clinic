import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ClockIcon, PhoneIcon, MailIcon, MapPinIcon } from 'lucide-react';
import BookingModal from '@/components/BookingModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const services = [
    {
      title: "General Dentistry",
      description: "Comprehensive oral health care including cleanings, fillings, and preventive treatments.",
      icon: "🦷"
    },
    {
      title: "Cosmetic Dentistry",
      description: "Enhance your smile with veneers, whitening, and aesthetic dental procedures.",
      icon: "✨"
    },
    {
      title: "Orthodontics",
      description: "Straighten your teeth with braces, clear aligners, and orthodontic treatments.",
      icon: "🦷"
    },
    {
      title: "Emergency Care",
      description: "Immediate dental care for urgent situations and dental emergencies.",
      icon: "🚨"
    }
  ];

  const faqs = [
    {
      question: "How do I prepare for my dental appointment?",
      answer: "Brush and floss before your visit, arrive 15 minutes early, and bring your insurance card and ID."
    },
    {
      question: "What insurance plans do you accept?",
      answer: "We accept most major insurance plans including Delta Dental, Blue Cross Blue Shield, and Aetna."
    },
    {
      question: "Can I reschedule my appointment?",
      answer: "Yes, you can reschedule up to 24 hours before your appointment by calling our office or using your booking reference."
    },
    {
      question: "What should I expect during my first visit?",
      answer: "Your first visit includes a comprehensive exam, X-rays if needed, and a discussion of your treatment plan."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header onBookNow={() => setIsBookingOpen(true)} />
      
      {/* Hero Section */}
      <section className="relative dental-gradient text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Your Perfect Smile Starts Here
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Experience exceptional dental care with our state-of-the-art facility and compassionate team. 
            Book your appointment today and take the first step towards optimal oral health.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-300"
            onClick={() => setIsBookingOpen(true)}
          >
            <CalendarIcon className="mr-2 h-5 w-5" />
            Book Your Appointment
          </Button>
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
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{service.icon}</div>
                  <CardTitle className="text-primary">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{service.description}</p>
                </CardContent>
              </Card>
            ))}
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
                    <p className="text-gray-600">123 Dental Plaza, Suite 200<br />Medical District, City, State 12345</p>
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
                      Office: (555) 123-SMILE<br />
                      Emergency: (555) 911-CARE
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

      {/* Emergency Contact */}
      <section className="py-12 dental-accent-bg">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-primary mb-4">Dental Emergency?</h2>
          <p className="text-gray-600 mb-6 text-lg">
            We provide emergency dental care. Call us immediately for urgent situations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
              <PhoneIcon className="mr-2 h-5 w-5" />
              Emergency Line: (555) 911-CARE
            </Button>
            <Button size="lg" onClick={() => setIsBookingOpen(true)}>
              <CalendarIcon className="mr-2 h-5 w-5" />
              Book Regular Appointment
            </Button>
          </div>
        </div>
      </section>

      {/* Insurance Information */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary mb-8">Insurance & Payment</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-primary">Insurance Accepted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">Delta Dental</Badge>
                  <Badge variant="secondary">Blue Cross Blue Shield</Badge>
                  <Badge variant="secondary">Aetna</Badge>
                  <Badge variant="secondary">Cigna</Badge>
                  <Badge variant="secondary">MetLife</Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-primary">Payment Options</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-600 space-y-2">
                  <li>✓ Cash & Check</li>
                  <li>✓ Credit & Debit Cards</li>
                  <li>✓ Flexible Payment Plans</li>
                  <li>✓ CareCredit Financing</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-primary">New Patient Special</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">$99</p>
                <p className="text-gray-600">Comprehensive exam, X-rays, and consultation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 dental-light-bg">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
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
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4 rounded-full"
            onClick={() => setIsBookingOpen(true)}
          >
            <CalendarIcon className="mr-2 h-5 w-5" />
            Book Now - It's Easy!
          </Button>
        </div>
      </section>

      <Footer />
      
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
};

export default Index;
