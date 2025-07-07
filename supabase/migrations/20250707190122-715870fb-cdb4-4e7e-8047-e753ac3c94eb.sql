
-- Create a table for dentist unavailable schedules
CREATE TABLE public.dentist_unavailable_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unavailable_date TEXT NOT NULL,
  unavailable_time TEXT,
  reason TEXT,
  is_full_day BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to control access
ALTER TABLE public.dentist_unavailable_schedules ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to view unavailable schedules (for booking validation)
CREATE POLICY "Anyone can view unavailable schedules" 
  ON public.dentist_unavailable_schedules 
  FOR SELECT 
  USING (true);

-- Create policy that allows anyone to insert unavailable schedules (admin access)
CREATE POLICY "Anyone can create unavailable schedules" 
  ON public.dentist_unavailable_schedules 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows anyone to update unavailable schedules
CREATE POLICY "Anyone can update unavailable schedules" 
  ON public.dentist_unavailable_schedules 
  FOR UPDATE 
  USING (true);

-- Create policy that allows anyone to delete unavailable schedules
CREATE POLICY "Anyone can delete unavailable schedules" 
  ON public.dentist_unavailable_schedules 
  FOR DELETE 
  USING (true);

-- Create an index for faster queries on date
CREATE INDEX idx_dentist_unavailable_schedules_date ON public.dentist_unavailable_schedules(unavailable_date);
