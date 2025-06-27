
import React from 'react';
import { Button } from '@/components/ui/button';
import { MonitorIcon } from 'lucide-react';

interface DeviceManagementProps {
  isDeviceRemembered: boolean;
  onForgetDevice: () => void;
  onLogout: () => void;
}

const DeviceManagement = ({ isDeviceRemembered, onForgetDevice, onLogout }: DeviceManagementProps) => {
  return (
    <div className="flex items-center space-x-2">
      {isDeviceRemembered && (
        <Button onClick={onForgetDevice} variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
          <MonitorIcon className="h-4 w-4 mr-2" />
          Forget Device
        </Button>
      )}
      <Button onClick={onLogout} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
        Logout
      </Button>
    </div>
  );
};

export default DeviceManagement;
