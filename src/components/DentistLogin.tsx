import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { UserIcon, LockIcon, CalendarIcon, CheckIcon, ClockIcon, RefreshCwIcon, DeviceIcon } from 'lucide-react';
import { getAppointments, updateAppointmentStatus, type StoredAppointment } from '@/utils/appointmentStorage';

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
    if (username === 'DENTIST' && password === 'APPOINTMENTS') {
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

  const handleStatusUpdate = (id: string, newStatus: 'Confirmed' | 'Pending') => {
    updateAppointmentStatus(id, newStatus);
    loadAppointments();
  };

  const pendingAppointments = appointments.filter(apt => apt.status === 'Pending');
  const confirmedAppointments = appointments.filter(apt => apt.status === 'Confirmed');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {isLoggedIn ? 'Patient Appointments Dashboard' : 'Healthcare Professional Access'}
          </DialogTitle>
        </DialogHeader>
        
        {!isLoggedIn ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10"
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
              <Label htmlFor="remember-device" className="text-sm flex items-center cursor-pointer">
                <DeviceIcon className="h-4 w-4 mr-1" />
                Remember this device
              </Label>
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Login
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold">Appointments Management</h3>
                <Button onClick={loadAppointments} variant="outline" size="sm">
                  <RefreshCwIcon className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                {isDeviceRemembered && (
                  <Button onClick={handleForgetDevice} variant="outline" size="sm">
                    <DeviceIcon className="h-4 w-4 mr-2" />
                    Forget Device
                  </Button>
                )}
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Appointments ({appointments.length})</TabsTrigger>
                <TabsTrigger value="pending" className="text-yellow-600">
                  Pending ({pendingAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="confirmed" className="text-green-600">
                  Confirmed ({confirmedAppointments.length})
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
                                appointment.status === 'Confirmed' 
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
                                    onClick={() => handleStatusUpdate(appointment.id, 'Confirmed')}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                  </Button>
                                )}
                                {appointment.status === 'Confirmed' && (
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
                                onClick={() => handleStatusUpdate(appointment.id, 'Confirmed')}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckIcon className="h-4 w-4 mr-1" />
                                Confirm
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
              
              <TabsContent value="confirmed" className="mt-4">
                <div className="space-y-4">
                  {confirmedAppointments.length === 0 ? (
                    <Card className="text-center py-8">
                      <CardContent>
                        <CheckIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
                        <p className="text-gray-500">No confirmed appointments</p>
                      </CardContent>
                    </Card>
                  ) : (
                    confirmedAppointments.map((appointment) => (
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
