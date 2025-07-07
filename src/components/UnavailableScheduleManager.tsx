
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CalendarIcon, ClockIcon, Trash2Icon, PlusIcon, RefreshCwIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UnavailableSchedule {
  id: string;
  unavailable_date: string;
  unavailable_time: string | null;
  reason: string | null;
  is_full_day: boolean;
  created_at: string;
}

const UnavailableScheduleManager = () => {
  const [schedules, setSchedules] = useState<UnavailableSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    unavailable_date: '',
    unavailable_time: '',
    reason: '',
    is_full_day: false,
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('dentist_unavailable_schedules')
        .select('*')
        .order('unavailable_date', { ascending: true });

      if (error) {
        console.error('Error loading schedules:', error);
        toast({
          title: "Error",
          description: "Failed to load unavailable schedules.",
          variant: "destructive",
        });
        return;
      }

      setSchedules(data || []);
    } catch (error) {
      console.error('Error loading schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.unavailable_date) {
      toast({
        title: "Error",
        description: "Please select a date.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.is_full_day && !formData.unavailable_time) {
      toast({
        title: "Error",
        description: "Please specify a time or mark as full day.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('dentist_unavailable_schedules')
        .insert({
          unavailable_date: formData.unavailable_date,
          unavailable_time: formData.is_full_day ? null : formData.unavailable_time,
          reason: formData.reason || null,
          is_full_day: formData.is_full_day,
        });

      if (error) {
        console.error('Error saving schedule:', error);
        toast({
          title: "Error",
          description: "Failed to save unavailable schedule.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Unavailable schedule has been saved.",
      });

      // Reset form
      setFormData({
        unavailable_date: '',
        unavailable_time: '',
        reason: '',
        is_full_day: false,
      });

      // Reload schedules
      await loadSchedules();
    } catch (error) {
      console.error('Error saving schedule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dentist_unavailable_schedules')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting schedule:', error);
        toast({
          title: "Error",
          description: "Failed to delete unavailable schedule.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Unavailable schedule has been deleted.",
      });

      await loadSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'Full Day';
    return timeString;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Mark Unavailable Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unavailable_date">Date *</Label>
                <Input
                  id="unavailable_date"
                  type="date"
                  value={formData.unavailable_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, unavailable_date: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unavailable_time">Time</Label>
                <Input
                  id="unavailable_time"
                  type="time"
                  value={formData.unavailable_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, unavailable_time: e.target.value }))}
                  disabled={formData.is_full_day}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_full_day"
                checked={formData.is_full_day}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    is_full_day: checked as boolean,
                    unavailable_time: checked ? '' : prev.unavailable_time
                  }));
                }}
              />
              <Label htmlFor="is_full_day" className="flex items-center cursor-pointer">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Full Day Unavailable
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for unavailability..."
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              <PlusIcon className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Add Unavailable Schedule'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current Unavailable Schedules</CardTitle>
          <Button onClick={loadSchedules} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCwIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCwIcon className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p>Loading schedules...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No unavailable schedules found</p>
              <p className="text-sm">Add schedules above to mark unavailable dates/times</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(schedule.unavailable_date)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {formatTime(schedule.unavailable_time)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {schedule.reason || '-'}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:border-red-200"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Unavailable Schedule</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this unavailable schedule? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(schedule.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnavailableScheduleManager;
