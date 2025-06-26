import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { UserIcon, LockIcon, CalendarIcon, CheckIcon, ClockIcon, RefreshCwIcon, MonitorIcon, BellIcon } from 'lucide-react';
import { getAppointments, updateAppointmentStatus, type StoredAppointment } from '@/utils/appointmentStorage';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    // Check if device is remembered on component mount
    const deviceRemembered = localStorage.getItem('dentist_device_remembered');
    if (deviceRemembered === 'true') {
      setIsDeviceRemembered(true);
      setIsLoggedIn(true);
      loadAppointments();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && !isDeviceRemembered) {
      loadAppointments();
    }
  }, [isLoggedIn, isDeviceRemembered]);

  const loadAppointments = () => {
    const stored = getAppointments();
    setAppointments(stored);
    console.log('Loaded appointments:', stored);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'DENTIST' && password === 'APARTMENTS') {
      setIsLoggedIn(true);
      setError('');
      
      // Save device if remember is checked
      if (rememberDevice) {
        localStorage.setItem('dentist_device_remembered', 'true');
        setIsDeviceRemembered(true);
      }
      
      loadAppointments();
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
    onClose();
  };

  const handleForgetDevice = () => {
    localStorage.removeItem('dentist_device_remembered');
    setIsDeviceRemembered(false);
    handleLogout();
  };

  const handleStatusUpdate = (id: string, newStatus: 'Done' | 'Pending') => {
    updateAppointmentStatus(id, newStatus);
    loadAppointments();
  };

  const handleNotifyPatient = (appointment: StoredAppointment) => {
    // For now, this will just show a toast notification
    // In a real implementation, this would send an email
    toast({
      title: "Notification Sent",
      description: `Reminder sent to ${appointment.patientName} at ${appointment.email}`,
    });
    console.log('Notifying patient:', appointment);
  };

  // Filter and sort appointments
  const pendingAppointments = appointments
    .filter(apt => apt.status === 'Pending')
    .sort((a, b) => {
      // Sort by date first, then by time (nearest appointments first)
      const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateComparison !== 0) return dateComparison;
      
      // If same date, sort by time
      const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });
  
  const doneAppointments = appointments
    .filter(apt => apt.status === 'Done')
    .sort((a, b) => {
      // Sort by bookedAt timestamp (latest done first)
      return new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime();
    });
  
  // Filter today's pending appointments and sort by time
  const today = new Date().toLocaleDateString();
  const todayPendingAppointments = appointments
    .filter(apt => apt.date === today && apt.status === 'Pending')
    .sort((a, b) => {
      // Convert time strings to minutes for comparison
      const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto bg-white text-gray-900 border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {isLoggedIn ? 'Patient Appointments Dashboard' : 'Healthcare Professional Access'}
          </DialogTitle>
        </DialogHeader>
        
        {!isLoggedIn ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-device"
                checked={rememberDevice}
                onCheckedChange={(checked) => setRememberDevice(checked as boolean)}
              />
              <Label htmlFor="remember-device" className="text-sm flex items-center cursor-pointer text-gray-700">
                <MonitorIcon className="h-4 w-4 mr-1" />
                Remember this device
              </Label>
            </div>
            
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Login
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-gray-900">Appointments Management</h3>
                <Button onClick={loadAppointments} variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <RefreshCwIcon className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                {isDeviceRemembered && (
                  <Button onClick={handleForgetDevice} variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <MonitorIcon className="h-4 w-4 mr-2" />
                    Forget Device
                  </Button>
                )}
                <Button onClick={handleLogout} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Logout
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Appointments ({appointments.length})</TabsTrigger>
                <TabsTrigger value="pending-today" className="text-blue-600">
                  Pending Today ({todayPendingAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-yellow-600">
                  Pending ({pendingAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="done" className="text-green-600">
                  Done ({doneAppointments.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <Card className="text-center py-8">
                      <CardContent>
                        <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No appointments found</p>
                        <p className="text-sm text-gray-400">Appointments will appear here when patients book them</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Appointment</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell>
                              <div>
                                <div className="font-semibold">{appointment.patientName}</div>
                                <div className="text-sm text-gray-500">
                                  {appointment.patientType} patient
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{appointment.email}</div>
                                <div>{appointment.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  {appointment.date}
                                </div>
                                <div className="flex items-center text-gray-500">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {appointment.time}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div><strong>Concern:</strong> {appointment.dentalConcern}</div>
                                {appointment.specialNotes && (
                                  <div><strong>Notes:</strong> {appointment.specialNotes}</div>
                                )}
                                {appointment.insurance && (
                                  <div><strong>Insurance:</strong> {appointment.insurance}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                appointment.status === 'Done' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {appointment.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {appointment.status === 'Pending' && (
                                  <Button
                                    onClick={() => handleStatusUpdate(appointment.id, 'Done')}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                  </Button>
                                )}
                                {appointment.status === 'Done' && (
                                  <Button
                                    onClick={() => handleStatusUpdate(appointment.id, 'Pending')}
                                    size="sm"
                                    variant="outline"
                                  >
                                    <ClockIcon className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="pending-today" className="mt-4">
                <div className="space-y-4">
                  {todayPendingAppointments.length === 0 ? (
                    <Card className="text-center py-8">
                      <CardContent>
                        <CalendarIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <p className="text-gray-500">No pending appointments for today</p>
                        <p className="text-sm text-gray-400">Today's pending appointments will appear here</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600 mb-4">
                        Showing pending appointments for {today} (sorted by time)
                      </div>
                      {todayPendingAppointments.map((appointment) => (
                        <Card key={appointment.id} className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between">
                              <span className="text-lg">{appointment.patientName}</span>
                              <div className="flex items-center space-x-2">
                                <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                                  {appointment.status}
                                </span>
                                <Button
                                  onClick={() => handleStatusUpdate(appointment.id, 'Done')}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckIcon className="h-4 w-4 mr-1" />
                                  Mark Done
                                </Button>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600">
                                  <ClockIcon className="h-4 w-4 mr-2" />
                                  {appointment.time}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <strong>Concern:</strong> {appointment.dentalConcern}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <strong>Patient Type:</strong> {appointment.patientType}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm text-gray-600">
                                  <strong>Email:</strong> {appointment.email}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <strong>Phone:</strong> {appointment.phone}
                                </div>
                                {appointment.insurance && (
                                  <div className="text-sm text-gray-600">
                                    <strong>Insurance:</strong> {appointment.insurance}
                                  </div>
                                )}
                              </div>
                            </div>
                            {appointment.specialNotes && (
                              <div className="mt-3 p-3 bg-gray-50 rounded">
                                <strong className="text-sm">Special Notes:</strong>
                                <p className="text-sm text-gray-600 mt-1">{appointment.specialNotes}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-4">
                <div className="space-y-4">
                  {pendingAppointments.length === 0 ? (
                    <Card className="text-center py-8">
                      <CardContent>
                        <ClockIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                        <p className="text-gray-500">No pending appointments</p>
                      </CardContent>
                    </Card>
                  ) : (
                    pendingAppointments.map((appointment) => (
                      <Card key={appointment.id} className="border-l-4 border-l-yellow-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-lg">{appointment.patientName}</span>
                            <div className="flex items-center space-x-2">
                              <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                                {appointment.status}
                              </span>
                              <Button
                                onClick={() => handleStatusUpdate(appointment.id, 'Done')}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckIcon className="h-4 w-4 mr-1" />
                                Mark Done
                              </Button>
                              <Button
                                onClick={() => handleNotifyPatient(appointment)}
                                size="sm"
                                variant="outline"
                                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                              >
                                <BellIcon className="h-4 w-4 mr-1" />
                                Notify
                              </Button>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                {appointment.date} at {appointment.time}
                              </div>
                              <div className="text-sm text-gray-600">
                                <strong>Concern:</strong> {appointment.dentalConcern}
                              </div>
                              <div className="text-sm text-gray-600">
                                <strong>Patient Type:</strong> {appointment.patientType}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-gray-600">
                                <strong>Email:</strong> {appointment.email}
                              </div>
                              <div className="text-sm text-gray-600">
                                <strong>Phone:</strong> {appointment.phone}
                              </div>
                              {appointment.insurance && (
                                <div className="text-sm text-gray-600">
                                  <strong>Insurance:</strong> {appointment.insurance}
                                </div>
                              )}
                            </div>
                          </div>
                          {appointment.specialNotes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <strong className="text-sm">Special Notes:</strong>
                              <p className="text-sm text-gray-600 mt-1">{appointment.specialNotes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="done" className="mt-4">
                <div className="space-y-4">
                  {doneAppointments.length === 0 ? (
                    <Card className="text-center py-8">
                      <CardContent>
                        <CheckIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
                        <p className="text-gray-500">No completed appointments</p>
                      </CardContent>
                    </Card>
                  ) : (
                    doneAppointments.map((appointment) => (
                      <Card key={appointment.id} className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-lg">{appointment.patientName}</span>
                            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                              {appointment.status}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                {appointment.date} at {appointment.time}
                              </div>
                              <div className="text-sm text-gray-600">
                                <strong>Concern:</strong> {appointment.dentalConcern}
                              </div>
                              <div className="text-sm text-gray-600">
                                <strong>Patient Type:</strong> {appointment.patientType}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-gray-600">
                                <strong>Email:</strong> {appointment.email}
                              </div>
                              <div className="text-sm text-gray-600">
                                <strong>Phone:</strong> {appointment.phone}
                              </div>
                              {appointment.insurance && (
                                <div className="text-sm text-gray-600">
                                  <strong>Insurance:</strong> {appointment.insurance}
                                </div>
                              )}
                            </div>
                          </div>
                          {appointment.specialNotes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <strong className="text-sm">Special Notes:</strong>
                              <p className="text-sm text-gray-600 mt-1">{appointment.specialNotes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DentistLogin;
