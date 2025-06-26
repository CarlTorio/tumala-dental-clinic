
export interface StoredAppointment {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'Done' | 'Pending';
  dateOfBirth: string;
  dentalConcern: string;
  patientType: 'new' | 'returning';
  specialNotes: string;
  insurance: string;
  bookedAt: string;
}

export const saveAppointment = (appointmentData: any): void => {
  const appointment: StoredAppointment = {
    id: Date.now().toString(),
    patientName: appointmentData.patientInfo.fullName,
    email: appointmentData.patientInfo.email,
    phone: appointmentData.patientInfo.phone,
    service: appointmentData.patientInfo.dentalConcern || 'General Consultation',
    date: appointmentData.date?.toLocaleDateString() || '',
    time: appointmentData.time,
    status: 'Pending',
    dateOfBirth: appointmentData.patientInfo.dateOfBirth,
    dentalConcern: appointmentData.patientInfo.dentalConcern,
    patientType: appointmentData.patientInfo.patientType,
    specialNotes: appointmentData.patientInfo.specialNotes,
    insurance: appointmentData.patientInfo.insurance,
    bookedAt: new Date().toISOString()
  };

  const existingAppointments = getAppointments();
  const updatedAppointments = [...existingAppointments, appointment];
  localStorage.setItem('dentalAppointments', JSON.stringify(updatedAppointments));
  
  console.log('Appointment saved:', appointment);
};

export const getAppointments = (): StoredAppointment[] => {
  try {
    const stored = localStorage.getItem('dentalAppointments');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading appointments:', error);
    return [];
  }
};

export const updateAppointmentStatus = (id: string, status: 'Done' | 'Pending'): void => {
  const appointments = getAppointments();
  const updatedAppointments = appointments.map(apt => 
    apt.id === id ? { ...apt, status } : apt
  );
  localStorage.setItem('dentalAppointments', JSON.stringify(updatedAppointments));
};

export const isTimeSlotBooked = (date: Date, time: string): boolean => {
  const appointments = getAppointments();
  const dateKey = date.toLocaleDateString();
  
  return appointments.some(appointment => 
    appointment.date === dateKey && appointment.time === time
  );
};
