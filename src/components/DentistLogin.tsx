
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserIcon, LockIcon, CalendarIcon } from 'lucide-react';

const DentistLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      patientName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      service: 'General Cleaning',
      date: '2024-06-26',
      time: '10:00 AM',
      status: 'Confirmed'
    },
    {
      id: 2,
      patientName: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 987-6543',
      service: 'Teeth Whitening',
      date: '2024-06-27',
      time: '2:00 PM',
      status: 'Pending'
    },
    {
      id: 3,
      patientName: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '(555) 456-7890',
      service: 'Root Canal',
      date: '2024-06-28',
      time: '9:00 AM',
      status: 'Confirmed'
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'DENTIST' && password === 'APPOINTMENTS') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setError('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-primary text-white hover:bg-primary/90">
          <UserIcon className="mr-2 h-4 w-4" />
          Dentist Login
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {isLoggedIn ? 'Patient Appointments' : 'Dentist Login'}
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
              <h3 className="text-lg font-semibold">All Appointments</h3>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
            
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{appointment.patientName}</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
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
                          <strong>Service:</strong> {appointment.service}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          <strong>Email:</strong> {appointment.email}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Phone:</strong> {appointment.phone}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DentistLogin;
