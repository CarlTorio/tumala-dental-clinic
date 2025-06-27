
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { UserIcon, LockIcon, MonitorIcon } from 'lucide-react';

interface LoginFormProps {
  username: string;
  password: string;
  error: string;
  rememberDevice: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRememberDeviceChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm = ({
  username,
  password,
  error,
  rememberDevice,
  onUsernameChange,
  onPasswordChange,
  onRememberDeviceChange,
  onSubmit
}: LoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-gray-700">Username</Label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
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
            onChange={(e) => onPasswordChange(e.target.value)}
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
          onCheckedChange={(checked) => onRememberDeviceChange(checked as boolean)}
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
  );
};

export default LoginForm;
