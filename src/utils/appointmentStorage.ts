import { supabase } from '@/integrations/supabase/client';

export interface StoredAppointment {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'Done' | 'Pending' | 'Didn\'t show up';
  dateOfBirth: string;
  dentalConcern: string;
  patientType: 'new' | 'returning';
  specialNotes: string;
  insurance: string;
  bookedAt: string;
}

export const saveAppointment = async (appointmentData: any): Promise<void> => {
  try {
    const appointment = {
      patient_name: appointmentData.patientInfo.fullName,
      email: appointmentData.patientInfo.email || '',
      phone: appointmentData.patientInfo.phone,
      service: appointmentData.patientInfo.dentalConcern || 'General Consultation',
      appointment_date: appointmentData.date?.toLocaleDateString() || '',
      appointment_time: appointmentData.time,
      status: 'Pending' as const,
      date_of_birth: appointmentData.patientInfo.dateOfBirth,
      dental_concern: appointmentData.patientInfo.dentalConcern,
      patient_type: appointmentData.patientInfo.patientType,
      special_notes: appointmentData.patientInfo.specialNotes || '',
      insurance: appointmentData.patientInfo.insurance || ''
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select()
      .single();

    if (error) {
      console.error('Error saving appointment:', error);
      throw error;
    }

    console.log('Appointment saved to Supabase:', data);
  } catch (error) {
    console.error('Failed to save appointment:', error);
    throw error;
  }
};

export const getAppointments = async (): Promise<StoredAppointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }

    // Transform the data to match the expected interface
    const transformedData = data?.map(appointment => ({
      id: appointment.id,
      patientName: appointment.patient_name,
      email: appointment.email || '',
      phone: appointment.phone,
      service: appointment.service,
      date: appointment.appointment_date,
      time: appointment.appointment_time,
      status: appointment.status as 'Done' | 'Pending' | 'Didn\'t show up',
      dateOfBirth: appointment.date_of_birth,
      dentalConcern: appointment.dental_concern,
      patientType: appointment.patient_type as 'new' | 'returning',
      specialNotes: appointment.special_notes || '',
      insurance: appointment.insurance || '',
      bookedAt: appointment.booked_at
    })) || [];

    return transformedData;
  } catch (error) {
    console.error('Error loading appointments:', error);
    return [];
  }
};

export const updateAppointmentStatus = async (id: string, status: 'Done' | 'Pending' | 'Didn\'t show up'): Promise<void> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }

    console.log('Appointment status updated successfully');
  } catch (error) {
    console.error('Failed to update appointment status:', error);
    throw error;
  }
};

export const isTimeSlotBooked = async (date: Date, time: string): Promise<boolean> => {
  try {
    const dateKey = date.toLocaleDateString();
    
    const { data, error } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', dateKey)
      .eq('appointment_time', time)
      .limit(1);

    if (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }

    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    return false;
  }
};

export const clearAllAppointments = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (error) {
      console.error('Error clearing all appointments:', error);
      throw error;
    }

    console.log('All appointments cleared successfully');
  } catch (error) {
    console.error('Failed to clear all appointments:', error);
    throw error;
  }
};

export const deleteDoneAppointments = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('status', 'Done');

    if (error) {
      console.error('Error deleting done appointments:', error);
      throw error;
    }

    console.log('Done appointments deleted successfully');
  } catch (error) {
    console.error('Failed to delete done appointments:', error);
    throw error;
  }
};
