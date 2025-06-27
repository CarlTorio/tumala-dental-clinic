
import React from 'react';
import { Button } from '@/components/ui/button';
import { HardDriveIcon } from 'lucide-react';

interface StorageUsageButtonProps {
  storageUsage: number | null;
}

const StorageUsageButton = ({ storageUsage }: StorageUsageButtonProps) => {
  return (
    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 cursor-default">
      <HardDriveIcon className="h-4 w-4 mr-2" />
      {storageUsage !== null ? `${storageUsage} MB` : 'Loading...'}
    </Button>
  );
};

export default StorageUsageButton;
