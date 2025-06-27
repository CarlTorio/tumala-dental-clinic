import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CalendarIcon, ClockIcon, UserIcon, PhoneIcon, MenuIcon, RefreshCwIcon, Trash2Icon } from 'lucide-react';
import { getAppointments, updateAppointmentStatus, clearAllAppointments, deleteDoneAppointments, type StoredAppointment } from '@/utils/appointmentStorage';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

const AppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState<StoredAppointment[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isDeletingDone, setIsDeletingDone] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const loadAppointments = async () => {
    try {
      setIsRefreshing(true);
      const stored = await getAppointments();
      setAppointments(stored);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    // Refresh appointments every 30 seconds
    const interval = setInterval(loadAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id: string, status: 'Done' | 'Pending' | 'Didn\'t show up') => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(apt => 
        apt.id === id ? { ...apt, status } : apt
      ));
      toast({
        title: "Success",
        description: `Appointment status updated to "${status}".`,
      });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearAllAppointments = async () => {
    try {
      setIsDeletingAll(true);
      await clearAllAppointments();
      setAppointments([]);
      toast({
        title: "Success",
        description: "All appointments have been cleared.",
      });
    } catch (error) {
      console.error('Error clearing appointments:', error);
      toast({
        title: "Error",
        description: "Failed to clear appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleDeleteDoneAppointments = async () => {
    try {
      setIsDeletingDone(true);
      await deleteDoneAppointments();
      setAppointments(prev => prev.filter(apt => apt.status !== 'Done'));
      toast({
        title: "Success",
        description: "All completed appointments have been deleted.",
      });
    } catch (error) {
      console.error('Error deleting done appointments:', error);
      toast({
        title: "Error",
        description: "Failed to delete completed appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingDone(false);
    }
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
    if (activeTab === 'no-show') return apt.status === 'Didn\'t show up';
    return true;
  });

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Done':
        return 'default';
      case 'Didn\'t show up':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const AppointmentCard = ({ appointment, showActions = true }: { appointment: StoredAppointment; showActions?: boolean }) => (
    <Card className="mb-4 shadow-sm border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-primary">
              {appointment.patientName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getBadgeVariant(appointment.status)}>
                {appointment.status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {appointment.patientType}
              </Badge>
            </div>
          </div>
          {showActions && (
            <div className="flex gap-2 flex-wrap">
              {appointment.status === 'Pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(appointment.id, 'Done')}
                    className="text-xs"
                  >
                    Mark Done
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleStatusChange(appointment.id, 'Didn\'t show up')}
                    className="text-xs bg-red-600 hover:bg-red-700"
                  >
                    Didn't show up
                  </Button>
                </>
              )}
              {appointment.status === 'Done' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(appointment.id, 'Pending')}
                  className="text-xs"
                >
                  Reopen
                </Button>
              )}
              {appointment.status === 'Didn\'t show up' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(appointment.id, 'Pending')}
                  className="text-xs"
                >
                  Reopen
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Date:</span>
              <span>{formatDate(appointment.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Time:</span>
              <span>{formatTime(appointment.time)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <PhoneIcon className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Phone:</span>
            <span>{appointment.phone}</span>
          </div>

          <div className="border-t pt-3">
            <div className="text-sm">
              <span className="font-medium">Service:</span>
              <span className="ml-2">{appointment.service}</span>
            </div>
            {appointment.specialNotes && (
              <div className="text-sm mt-2">
                <span className="font-medium">Notes:</span>
                <span className="ml-2 text-gray-600">{appointment.specialNotes}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DashboardContent = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary">Patient Appointments</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAppointments}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCwIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isDeletingDone || appointments.filter(apt => apt.status === 'Done').length === 0}
                className="flex items-center gap-2"
              >
                <Trash2Icon className="h-4 w-4" />
                Clear Done
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Completed Appointments</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all completed appointments. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteDoneAppointments}
                  disabled={isDeletingDone}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeletingDone ? 'Deleting...' : 'Delete Completed'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeletingAll || appointments.length === 0}
                className="flex items-center gap-2"
              >
                <Trash2Icon className="h-4 w-4" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Appointments</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete ALL appointments from the database. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAllAppointments}
                  disabled={isDeletingAll}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeletingAll ? 'Clearing...' : 'Clear All'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Badge variant="outline" className="text-sm">
            {filteredAppointments.length} appointments
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <RefreshCwIcon className="h-6 w-6 animate-spin text-primary" />
            <p className="text-gray-500">Loading appointments...</p>
          </div>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({appointments.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({appointments.filter(apt => apt.status === 'Pending').length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Done ({appointments.filter(apt => apt.status === 'Done').length})
            </TabsTrigger>
            <TabsTrigger value="no-show">
              No Show ({appointments.filter(apt => apt.status === 'Didn\'t show up').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <Card className="p-8 text-center">
                  <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No appointments found</p>
                </Card>
              ) : (
                filteredAppointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} showActions={false} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <Card className="p-8 text-center">
                  <ClockIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No pending appointments</p>
                </Card>
              ) : (
                filteredAppointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <Card className="p-8 text-center">
                  <UserIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No completed appointments</p>
                </Card>
              ) : (
                filteredAppointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="no-show" className="mt-4">
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <Card className="p-8 text-center">
                  <UserIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No no-show appointments</p>
                </Card>
              ) : (
                filteredAppointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
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
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Appointments Dashboard</SheetTitle>
            <SheetDescription>
              Manage and view all patient appointments
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
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
