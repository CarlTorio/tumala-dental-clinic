
import React from 'react';
import AppointmentsDashboard from '@/components/AppointmentsDashboard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Appointments = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <AppointmentsDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Appointments;
