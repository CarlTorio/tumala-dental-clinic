import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserIcon, PhoneIcon, MailIcon } from 'lucide-react';
import type { AppointmentData } from './BookingModal';

interface PatientFormProps {
  onSubmit: (data: AppointmentData['patientInfo']) => void;
  initialData: AppointmentData['patientInfo'];
}

const PatientForm = ({ onSubmit, initialData }: PatientFormProps) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobYear, setDobYear] = useState('');

  // Initialize date of birth selects from existing data
  React.useEffect(() => {
    if (initialData.dateOfBirth) {
      const date = new Date(initialData.dateOfBirth);
      setDobMonth((date.getMonth() + 1).toString().padStart(2, '0'));
      setDobDay(date.getDate().toString().padStart(2, '0'));
      setDobYear(date.getFullYear().toString());
    }
  }, [initialData.dateOfBirth]);

  // Update formData when individual date components change
  React.useEffect(() => {
    if (dobMonth && dobDay && dobYear) {
      const dateString = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;
      setFormData(prev => ({
        ...prev,
        dateOfBirth: dateString
      }));
    }
  }, [dobMonth, dobDay, dobYear]);

  const dentalConcerns = [
    'Routine Cleaning',
    'Tooth Pain',
    'Cosmetic Consultation',
    'Orthodontic Consultation',
    'Emergency Care',
    'Filling/Restoration',
    'Crown/Bridge',
    'Root Canal',
    'Gum Disease Treatment',
    'Other'
  ];

  const insuranceProviders = [
    'No Insurance',
    'Delta Dental',
    'Blue Cross Blue Shield',
    'Aetna',
    'Cigna',
    'MetLife',
    'Humana',
    'Guardian',
    'Other'
  ];

  // Generate months array
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Generate days array (1-31)
  const days = Array.from({ length: 31 }, (_, i) => {
    const day = (i + 1).toString().padStart(2, '0');
    return { value: day, label: day };
  });

  // Generate years array (current year - 100 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => {
    const year = (currentYear - i).toString();
    return { value: year, label: year };
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\(?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!dobMonth || !dobDay || !dobYear) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.dentalConcern) {
      newErrors.dentalConcern = 'Please select your dental concern';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof AppointmentData['patientInfo'], value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDateChange = (type: 'month' | 'day' | 'year', value: string) => {
    if (type === 'month') setDobMonth(value);
    if (type === 'day') setDobDay(value);
    if (type === 'year') setDobYear(value);
    
    // Clear date of birth error when user selects values
    if (errors.dateOfBirth) {
      setErrors(prev => ({
        ...prev,
        dateOfBirth: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-primary" />
            <span>Personal Information</span>
            <Badge className="ml-2">Required</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={errors.fullName ? 'border-red-500' : ''}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
            
            <div>
              <Label>Date of Birth *</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select value={dobMonth} onValueChange={(value) => handleDateChange('month', value)}>
                  <SelectTrigger className={errors.dateOfBirth ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={dobDay} onValueChange={(value) => handleDateChange('day', value)}>
                  <SelectTrigger className={errors.dateOfBirth ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={dobYear} onValueChange={(value) => handleDateChange('year', value)}>
                  <SelectTrigger className={errors.dateOfBirth ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={errors.phone ? 'border-red-500' : ''}
                placeholder="(555) 123-4567"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Patient Type *</Label>
            <RadioGroup
              value={formData.patientType}
              onValueChange={(value) => handleInputChange('patientType', value as 'new' | 'returning')}
              className="flex space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new">New Patient</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="returning" id="returning" />
                <Label htmlFor="returning">Returning Patient</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="dentalConcern">Reason for Visit *</Label>
            <Select
              value={formData.dentalConcern}
              onValueChange={(value) => handleInputChange('dentalConcern', value)}
            >
              <SelectTrigger className={errors.dentalConcern ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select your dental concern" />
              </SelectTrigger>
              <SelectContent>
                {dentalConcerns.map((concern) => (
                  <SelectItem key={concern} value={concern}>
                    {concern}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.dentalConcern && (
              <p className="text-red-500 text-sm mt-1">{errors.dentalConcern}</p>
            )}
          </div>

          <div>
            <Label htmlFor="insurance">Insurance Provider</Label>
            <Select
              value={formData.insurance}
              onValueChange={(value) => handleInputChange('insurance', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your insurance provider" />
              </SelectTrigger>
              <SelectContent>
                {insuranceProviders.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="specialNotes">Special Notes or Requirements</Label>
            <Textarea
              id="specialNotes"
              value={formData.specialNotes}
              onChange={(e) => handleInputChange('specialNotes', e.target.value)}
              placeholder="Any special accommodations, medications, or notes for the dentist..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-800 mb-2">Before Your Visit:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Arrive 15 minutes early for paperwork</li>
            <li>• Bring a valid ID and insurance card</li>
            <li>• List of current medications</li>
            <li>• We'll send a confirmation email with all details</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button type="submit" size="lg" className="px-8">
          Continue to Confirmation
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;
