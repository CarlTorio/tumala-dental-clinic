
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getAppointments, updateAppointmentStatus, clearAllAppointments, deleteAppointment, type StoredAppointment } from '@/utils/appointmentStorage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from './DentistLogin/LoginForm';
import DashboardHeader from './DentistLogin/DashboardHeader';
import AppointmentTabs from './AppointmentTabs';

interface DentistLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const DentistLogin = ({ isOpen, onClose }: DentistLoginProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState<StoredAppointment[]>([]);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isDeviceRemembered, setIsDeviceRemembered] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [storageUsage, setStorageUsage] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    // Check if device is remembered on component mount
    const deviceRemembered = localStorage.getItem('dentist_device_remembered');
    if (deviceRemembered === 'true') {
      setIsDeviceRemembered(true);
      setIsLoggedIn(true);
      loadAppointments();
      loadStorageUsage();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && !isDeviceRemembered) {
      loadAppointments();
      loadStorageUsage();
    }
  }, [isLoggedIn, isDeviceRemembered]);

  const loadStorageUsage = async () => {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error fetching storage buckets:', error);
        return;
      }

      let totalSize = 0;
      
      // Get size from all buckets
      for (const bucket of data) {
        const { data: files, error: filesError } = await supabase.storage
          .from(bucket.name)
          .list();
          
        if (!filesError && files) {
          for (const file of files) {
            if (file.metadata?.size) {
              totalSize += file.metadata.size;
            }
          }
        }
      }

      // Convert bytes to MB
      const sizeInMB = totalSize / (1024 * 1024);
      setStorageUsage(Math.round(sizeInMB * 100) / 100); // Round to 2 decimal places
    } catch (error) {
      console.error('Error calculating storage usage:', error);
    }
  };

  const loadAppointments = async () => {
    try {
      const stored = await getAppointments();
      setAppointments(stored);
      console.log('Loaded appointments:', stored);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'DENTIST' && password === 'DENTIST') {
      setIsLoggedIn(true);
      setError('');
      
      // Save device if remember is checked
      if (rememberDevice) {
        localStorage.setItem('dentist_device_remembered', 'true');
        setIsDeviceRemembered(true);
      }
      
      loadAppointments();
      loadStorageUsage();
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setError('');
    setRememberDevice(false);
    setStorageUsage(null);
    onClose();
  };

  const handleForgetDevice = () => {
    localStorage.removeItem('dentist_device_remembered');
    setIsDeviceRemembered(false);
    handleLogout();
  };

  const handleStatusUpdate = async (id: string, newStatus: 'Done' | 'Pending' | 'Didn\'t show up') => {
    try {
      await updateAppointmentStatus(id, newStatus);
      await loadAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await deleteAppointment(id);
      setAppointments(prev => prev.filter(apt => apt.id !== id));
      toast({
        title: "Success",
        description: "Appointment has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Error",
        description: "Failed to delete appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearAllAppointments = async () => {
    try {
      setIsClearingAll(true);
      await clearAllAppointments();
      setAppointments([]);
      toast({
        title: "Success",
        description: "All appointments have been cleared from the database.",
      });
    } catch (error) {
      console.error('Error clearing all appointments:', error);
      toast({
        title: "Error",
        description: "Failed to clear appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClearingAll(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto bg-white text-gray-900 border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {isLoggedIn ? 'Patient Appointments Dashboard' : 'Healthcare Professional Access'}
          </DialogTitle>
        </DialogHeader>
        
        {!isLoggedIn ? (
          <LoginForm
            username={username}
            password={password}
            error={error}
            rememberDevice={rememberDevice}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onRememberDeviceChange={setRememberDevice}
            onSubmit={handleLogin}
          />
        ) : (
          <div className="space-y-6">
            <DashboardHeader
              appointments={appointments}
              isClearingAll={isClearingAll}
              storageUsage={storageUsage}
              isDeviceRemembered={isDeviceRemembered}
              onRefresh={loadAppointments}
              onClearAll={handleClearAllAppointments}
              onForgetDevice={handleForgetDevice}
              onLogout={handleLogout}
            />
            
            <AppointmentTabs
              appointments={appointments}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onStatusChange={handleStatusUpdate}
              onDelete={handleDeleteAppointment}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DentistLogin;
