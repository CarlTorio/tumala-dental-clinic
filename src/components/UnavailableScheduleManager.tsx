import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, ClockIcon, Trash2Icon, PlusIcon, RefreshCwIcon, CalendarXIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { getDay } from 'date-fns';

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
  const [isMarkingWholeDay, setIsMarkingWholeDay] = useState(false);
  const { toast } = useToast();

  // Form state for daily availability
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [reason, setReason] = useState('');

  // Generate time slots based on the day of the week
  const generateTimeSlots = (dateString: string) => {
    if (!dateString) return [];
    
    const date = new Date(dateString + 'T00:00:00');
    const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, etc.
    const slots = [];
    
    if (dayOfWeek === 0) {
      // Sunday: 1:00 PM to 7:00 PM
      for (let hour = 13; hour < 19; hour++) {
        slots.push(`${hour}:00`);
        slots.push(`${hour}:30`);
      }
    } else {
      // Monday-Saturday: 9:00 AM to 7:00 PM
      for (let hour = 9; hour < 19; hour++) {
        slots.push(`${hour}:00`);
        slots.push(`${hour}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots(selectedDate);

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

  const handleTimeToggle = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const handleMarkWholeDay = async () => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsMarkingWholeDay(true);
      
      // Get all time slots for the selected date
      const allTimeSlots = generateTimeSlots(selectedDate);
      
      // Create entries for all time slots
      const entries = allTimeSlots.map(time => ({
        unavailable_date: selectedDate,
        unavailable_time: time,
        reason: reason || 'Whole day marked as unavailable',
        is_full_day: false, // We're still creating individual time slots
      }));

      const { error } = await supabase
        .from('dentist_unavailable_schedules')
        .insert(entries);

      if (error) {
        console.error('Error marking whole day:', error);
        toast({
          title: "Error",
          description: "Failed to mark whole day as unavailable.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Whole day marked as unavailable (${allTimeSlots.length} time slots).`,
      });

      // Reset form
      setSelectedDate('');
      setSelectedTimes([]);
      setReason('');

      // Reload schedules
      await loadSchedules();
    } catch (error) {
      console.error('Error marking whole day:', error);
    } finally {
      setIsMarkingWholeDay(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date.",
        variant: "destructive",
      });
      return;
    }

    if (selectedTimes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one time slot.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create entries for each selected time
      const entries = selectedTimes.map(time => ({
        unavailable_date: selectedDate,
        unavailable_time: time,
        reason: reason || null,
        is_full_day: false,
      }));

      const { error } = await supabase
        .from('dentist_unavailable_schedules')
        .insert(entries);

      if (error) {
        console.error('Error saving schedules:', error);
        toast({
          title: "Error",
          description: "Failed to save unavailable schedules.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `${selectedTimes.length} time slots marked as unavailable.`,
      });

      // Reset form
      setSelectedDate('');
      setSelectedTimes([]);
      setReason('');

      // Reload schedules
      await loadSchedules();
    } catch (error) {
      console.error('Error saving schedules:', error);
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
    const [hour, minute] = timeString.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  // Group schedules by date for better display
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const date = schedule.unavailable_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(schedule);
    return acc;
  }, {} as Record<string, UnavailableSchedule[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Mark Daily Unavailability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="unavailable_date">Select Date *</Label>
              <Input
                id="unavailable_date"
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTimes([]); // Reset selected times when date changes
                }}
                required
              />
            </div>

            {selectedDate && (
              <>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleMarkWholeDay}
                    disabled={isMarkingWholeDay}
                    className="flex items-center gap-2"
                  >
                    <CalendarXIcon className="h-4 w-4" />
                    {isMarkingWholeDay ? 'Marking Whole Day...' : 'Mark Whole Day Unavailable'}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Select Specific Unavailable Time Slots</Label>
                    <p className="text-sm text-gray-500 mb-3">
                      Click on time slots to mark them as unavailable. You can select multiple times.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {timeSlots.map(time => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTimes.includes(time) ? "default" : "outline"}
                        size="sm"
                        className={`text-xs ${
                          selectedTimes.includes(time) 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'hover:bg-red-50 hover:border-red-200'
                        }`}
                        onClick={() => handleTimeToggle(time)}
                      >
                        {formatTime(time)}
                      </Button>
                    ))}
                  </div>

                  {selectedTimes.length > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium text-red-800 mb-2">
                        Selected unavailable times ({selectedTimes.length}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTimes.map(time => (
                          <Badge key={time} variant="destructive" className="text-xs">
                            {formatTime(time)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for unavailability..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting || selectedTimes.length === 0} 
              className="w-full"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : `Mark ${selectedTimes.length} Time Slots as Unavailable`}
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
          ) : Object.keys(groupedSchedules).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No unavailable schedules found</p>
              <p className="text-sm">Add schedules above to mark unavailable dates/times</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedSchedules)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, dateSchedules]) => (
                  <Card key={date} className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 mr-2" />
                          {formatDate(date)}
                        </div>
                        <Badge variant="outline" className="text-red-600">
                          {dateSchedules.length} slots unavailable
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Unavailable Times:</p>
                          <div className="flex flex-wrap gap-2">
                            {dateSchedules.map((schedule) => (
                              <div key={schedule.id} className="flex items-center gap-2">
                                <Badge variant="destructive" className="text-xs">
                                  <ClockIcon className="h-3 w-3 mr-1" />
                                  {formatTime(schedule.unavailable_time)}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                                  onClick={() => handleDelete(schedule.id)}
                                >
                                  <Trash2Icon className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {dateSchedules[0]?.reason && (
                          <div className="p-3 bg-gray-50 rounded">
                            <p className="text-sm"><strong>Reason:</strong> {dateSchedules[0].reason}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnavailableScheduleManager;
