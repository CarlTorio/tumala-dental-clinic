
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ClockIcon, UserIcon, CheckIcon, ArrowLeftIcon } from 'lucide-react';
import AppointmentCalendar from '@/components/AppointmentCalendar';
import PatientForm from '@/components/PatientForm';
import BookingConfirmation from '@/components/BookingConfirmation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AppointmentData {
  date: Date | null;
  time: string;
  patientInfo: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    dentalConcern: string;
    patientType: 'new' | 'returning';
    specialNotes: string;
    insurance: string;
  };
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    date: null,
    time: '',
    patientInfo: {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      dentalConcern: '',
      patientType: 'new',
      specialNotes: '',
      insurance: ''
    }
  });

  const handleDateTimeSelect = (date: Date, time: string) => {
    setAppointmentData(prev => ({
      ...prev,
      date,
      time
    }));
    setCurrentStep(2);
  };

  const handlePatientInfoSubmit = (patientInfo: AppointmentData['patientInfo']) => {
    setAppointmentData(prev => ({
      ...prev,
      patientInfo
    }));
    setCurrentStep(3);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setAppointmentData({
      date: null,
      time: '',
      patientInfo: {
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        dentalConcern: '',
        patientType: 'new',
        specialNotes: '',
        insurance: ''
      }
    });
    onClose();
  };

  const steps = [
    { number: 1, title: 'Select Date & Time', icon: CalendarIcon },
    { number: 2, title: 'Patient Information', icon: UserIcon },
    { number: 3, title: 'Confirmation', icon: CheckIcon }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary text-center">
            Book Your Dental Appointment
          </DialogTitle>
          
          {/* Progress Steps */}
          <div className="flex justify-center space-x-8 mt-6">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center space-x-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.number 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-primary' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="mt-6">
          {/* Step 1: Calendar Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Choose Your Preferred Date and Time</h3>
                <p className="text-gray-600">Select an available appointment slot from our calendar</p>
              </div>
              <AppointmentCalendar onSelect={handleDateTimeSelect} />
            </div>
          )}

          {/* Step 2: Patient Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span>Back to Calendar</span>
                </Button>
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Patient Information</h3>
                  <p className="text-gray-600 text-sm">
                    Selected: {appointmentData.date?.toLocaleDateString()} at {appointmentData.time}
                  </p>
                </div>
                <div></div>
              </div>
              
              <PatientForm
                onSubmit={handlePatientInfoSubmit}
                initialData={appointmentData.patientInfo}
              />
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span>Back to Form</span>
                </Button>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-600">Appointment Confirmed!</h3>
                </div>
                <div></div>
              </div>
              
              <BookingConfirmation
                appointmentData={appointmentData}
                onClose={handleClose}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
