
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CalendarIcon, ClockIcon, UserIcon, PhoneIcon, MailIcon, MenuIcon, FilterIcon } from 'lucide-react';
import { getAppointments, updateAppointmentStatus, type StoredAppointment } from '@/utils/appointmentStorage';
import { useIsMobile } from '@/hooks/use-mobile';

const AppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState<StoredAppointment[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadAppointments = () => {
      const stored = getAppointments();
      setAppointments(stored);
    };

    loadAppointments();
    // Refresh appointments every 30 seconds
    const interval = setInterval(loadAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (id: string, status: 'Done' | 'Pending') => {
    updateAppointmentStatus(id, status);
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return apt.status === 'Pending';
    if (activeTab === 'completed') return apt.status === 'Done';
    return true;
  });

  const AppointmentCard = ({ appointment }: { appointment: StoredAppointment }) => (
    <Card className="mb-3 shadow-sm border-l-4 border-l-primary">
      <CardHeader className="pb-2 px-3 pt-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-semibold text-primary">
              {appointment.patientName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={appointment.status === 'Done' ? 'default' : 'secondary'} className="text-xs">
                {appointment.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {appointment.patientType}
              </Badge>
            </div>
          </div>
          <Button
            size="sm"
            variant={appointment.status === 'Done' ? 'outline' : 'default'}
            onClick={() => handleStatusChange(appointment.id, appointment.status === 'Done' ? 'Pending' : 'Done')}
            className="text-xs px-2 py-1 h-7"
          >
            {appointment.status === 'Done' ? 'Reopen' : 'Complete'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 pb-3">
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-3 w-3 text-gray-500" />
              <span className="font-medium">Date:</span>
              <span className="text-xs">{formatDate(appointment.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon className="h-3 w-3 text-gray-500" />
              <span className="font-medium">Time:</span>
              <span className="text-xs">{formatTime(appointment.time)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-sm">
              <PhoneIcon className="h-3 w-3 text-gray-500" />
              <span className="font-medium">Phone:</span>
              <span className="text-xs">{appointment.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MailIcon className="h-3 w-3 text-gray-500" />
              <span className="font-medium">Email:</span>
              <span className="truncate text-xs">{appointment.email}</span>
            </div>
          </div>

          <div className="border-t pt-2">
            <div className="text-sm">
              <span className="font-medium">Service:</span>
              <span className="ml-2 text-xs">{appointment.service}</span>
            </div>
            {appointment.specialNotes && (
              <div className="text-sm mt-1">
                <span className="font-medium">Notes:</span>
                <span className="ml-2 text-gray-600 text-xs">{appointment.specialNotes}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DashboardContent = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-primary">Patient Appointments</h2>
        <Badge variant="outline" className="text-xs">
          {filteredAppointments.length} appointments
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-9">
          <TabsTrigger value="all" className="text-xs">All ({appointments.length})</TabsTrigger>
          <TabsTrigger value="pending" className="text-xs">
            Pending ({appointments.filter(apt => apt.status === 'Pending').length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">
            Done ({appointments.filter(apt => apt.status === 'Done').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-3">
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
            {filteredAppointments.length === 0 ? (
              <Card className="p-6 text-center">
                <CalendarIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 text-sm">No appointments found</p>
              </Card>
            ) : (
              filteredAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-3">
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
            {filteredAppointments.length === 0 ? (
              <Card className="p-6 text-center">
                <ClockIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 text-sm">No pending appointments</p>
              </Card>
            ) : (
              filteredAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-3">
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
            {filteredAppointments.length === 0 ? (
              <Card className="p-6 text-center">
                <UserIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 text-sm">No completed appointments</p>
              </Card>
            ) : (
              filteredAppointments.map(appointment => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <MenuIcon className="h-4 w-4" />
            Appointments
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh] overflow-hidden">
          <SheetHeader className="pb-3">
            <SheetTitle className="text-lg">Appointments Dashboard</SheetTitle>
            <SheetDescription className="text-sm">
              Manage and view all patient appointments
            </SheetDescription>
          </SheetHeader>
          <div className="h-full overflow-hidden">
            <DashboardContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <DashboardContent />
    </div>
  );
};

export default AppointmentsDashboard;
