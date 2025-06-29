
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PatientForm from '@/components/PatientForm';
import BookingConfirmation from '@/components/BookingConfirmation';

export interface PatientInfo {
  fullName: string;
  phone: string;
  email: string;
  age: string;
  dateOfBirth: string;
  patientType: 'new' | 'returning';
  dentalConcern: string;
  specialNotes?: string;
}

export interface AppointmentData {
  date: Date | null;
  time: string;
  patientInfo: PatientInfo;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    date: null,
    time: '',
    patientInfo: {
      fullName: '',
      phone: '',
      email: '',
      age: '',
      dateOfBirth: '',
      patientType: 'new',
      dentalConcern: '',
      specialNotes: ''
    }
  });

  const handleFormSubmit = (data: PatientInfo) => {
    setAppointmentData(prev => ({
      ...prev,
      patientInfo: data
    }));
    setStep('confirmation');
  };

  const handleClose = () => {
    setStep('form');
    setAppointmentData({
      date: null,
      time: '',
      patientInfo: {
        fullName: '',
        phone: '',
        email: '',
        age: '',
        dateOfBirth: '',
        patientType: 'new',
        dentalConcern: '',
        specialNotes: ''
      }
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 mx-4 sm:mx-auto rounded-xl sm:rounded-lg">
        {step === 'form' ? (
          <PatientForm 
            onSubmit={handleFormSubmit} 
            initialData={appointmentData.patientInfo} 
          />
        ) : (
          <BookingConfirmation 
            appointmentData={appointmentData} 
            onClose={handleClose} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
