
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircleIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  PhoneIcon, 
  MailIcon,
  MapPinIcon,
  PrinterIcon,
  ShareIcon
} from 'lucide-react';
import { format } from 'date-fns';
import type { AppointmentData } from './BookingModal';
import { useToast } from '@/hooks/use-toast';

interface BookingConfirmationProps {
  appointmentData: AppointmentData;
  onClose: () => void;
}

const BookingConfirmation = ({ appointmentData, onClose }: BookingConfirmationProps) => {
  const { toast } = useToast();
  
  // Generate a unique booking reference
  const bookingReference = `DC${Date.now().toString().slice(-6)}`;

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const handleSendConfirmation = () => {
    // Simulate sending email confirmation
    toast({
      title: "Confirmation Email Sent!",
      description: `A confirmation email has been sent to ${appointmentData.patientInfo.email}`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const confirmationDetails = {
    patient: appointmentData.patientInfo.fullName,
    email: appointmentData.patientInfo.email,
    phone: appointmentData.patientInfo.phone,
    date: appointmentData.date ? format(appointmentData.date, 'EEEE, MMMM d, yyyy') : '',
    time: formatTime(appointmentData.time),
    service: appointmentData.patientInfo.dentalConcern,
    patientType: appointmentData.patientInfo.patientType,
    insurance: appointmentData.patientInfo.insurance || 'Not provided',
    reference: bookingReference
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Appointment Confirmed!</h2>
        <p className="text-gray-600">
          Your dental appointment has been successfully booked. We look forward to seeing you!
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span>Appointment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Booking Reference:</span>
              <Badge variant="outline" className="font-mono">
                {confirmationDetails.reference}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-semibold">{confirmationDetails.date}</p>
                  <p className="text-sm text-gray-600">Date</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ClockIcon className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-semibold">{confirmationDetails.time}</p>
                  <p className="text-sm text-gray-600">Time (30 minutes)</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <UserIcon className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-semibold">{confirmationDetails.service}</p>
                  <p className="text-sm text-gray-600">Service</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5 text-primary" />
              <span>Patient Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="font-semibold">{confirmationDetails.patient}</p>
                <p className="text-sm text-gray-600">Patient Name</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <MailIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">{confirmationDetails.email}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">{confirmationDetails.phone}</span>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-sm">
                  <span className="font-semibold">Patient Type:</span> {' '}
                  <Badge variant="secondary">
                    {confirmationDetails.patientType === 'new' ? 'New Patient' : 'Returning Patient'}
                  </Badge>
                </p>
                <p className="text-sm mt-1">
                  <span className="font-semibold">Insurance:</span> {confirmationDetails.insurance}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinic Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <MapPinIcon className="h-5 w-5" />
            <span>Clinic Location & Contact</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-blue-700">
            <div>
              <h4 className="font-semibold mb-2">DentalCare Plus</h4>
              <p className="text-sm">123 Dental Plaza, Suite 200</p>
              <p className="text-sm">Medical District, City, State 12345</p>
            </div>
            <div>
              <p className="text-sm"><strong>Phone:</strong> (555) 123-SMILE</p>
              <p className="text-sm"><strong>Emergency:</strong> (555) 911-CARE</p>
              <p className="text-sm"><strong>Email:</strong> info@dentalcareplus.com</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-Appointment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-Appointment Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold text-primary mb-2">What to Bring:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Valid photo ID (driver's license, passport, etc.)</li>
                <li>• Insurance card and any relevant insurance documents</li>
                <li>• List of current medications and supplements</li>
                <li>• Previous dental records or X-rays (if available)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-primary mb-2">Before Your Visit:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Arrive 15 minutes early to complete any remaining paperwork</li>
                <li>• Brush and floss your teeth before the appointment</li>
                <li>• Avoid eating a large meal 2 hours before your visit</li>
                <li>• If you have dental anxiety, let us know - we can help!</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Policy */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-orange-800 mb-2">Cancellation & Rescheduling Policy</h4>
          <p className="text-sm text-orange-700">
            Please provide at least 24 hours notice if you need to cancel or reschedule your appointment. 
            You can call us at (555) 123-SMILE or use your booking reference number: 
            <strong> {confirmationDetails.reference}</strong>
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleSendConfirmation} variant="outline" className="flex items-center space-x-2">
          <MailIcon className="h-4 w-4" />
          <span>Email Confirmation</span>
        </Button>
        
        <Button onClick={handlePrint} variant="outline" className="flex items-center space-x-2">
          <PrinterIcon className="h-4 w-4" />
          <span>Print Details</span>
        </Button>
        
        <Button onClick={onClose} size="lg" className="bg-primary hover:bg-primary/90">
          Done
        </Button>
      </div>

      {/* Contact for Questions */}
      <div className="text-center text-sm text-gray-600">
        <p>Questions about your appointment?</p>
        <p>Call us at <strong>(555) 123-SMILE</strong> or email <strong>info@dentalcareplus.com</strong></p>
      </div>
    </div>
  );
};

export default BookingConfirmation;
