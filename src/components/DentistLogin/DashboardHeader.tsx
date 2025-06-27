
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RefreshCwIcon, Trash2Icon } from 'lucide-react';
import StorageUsageButton from './StorageUsageButton';
import DeviceManagement from './DeviceManagement';

interface DashboardHeaderProps {
  appointments: any[];
  isClearingAll: boolean;
  storageUsage: number | null;
  isDeviceRemembered: boolean;
  onRefresh: () => void;
  onClearAll: () => void;
  onForgetDevice: () => void;
  onLogout: () => void;
}

const DashboardHeader = ({
  appointments,
  isClearingAll,
  storageUsage,
  isDeviceRemembered,
  onRefresh,
  onClearAll,
  onForgetDevice,
  onLogout
}: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h3 className="text-lg font-semibold text-gray-900">Appointments Management</h3>
        <Button onClick={onRefresh} variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size="sm" 
              disabled={isClearingAll || appointments.length === 0}
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
                onClick={onClearAll}
                disabled={isClearingAll}
                className="bg-red-600 hover:bg-red-700"
              >
                {isClearingAll ? 'Clearing...' : 'Clear All'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex items-center space-x-2">
        <StorageUsageButton storageUsage={storageUsage} />
        <DeviceManagement 
          isDeviceRemembered={isDeviceRemembered}
          onForgetDevice={onForgetDevice}
          onLogout={onLogout}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
