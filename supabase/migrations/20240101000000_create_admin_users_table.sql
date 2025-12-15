-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS (Row Level Security) on the table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can insert new admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON public.admin_users;

-- Create policies for admin_users
-- Only allow viewing if user is an admin
CREATE POLICY "Allow select for admins" ON public.admin_users
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  ));

-- Only allow inserting if user is an admin
CREATE POLICY "Allow insert for admins" ON public.admin_users
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  ));

-- Only allow updating if user is an admin
CREATE POLICY "Allow update for admins" ON public.admin_users
  FOR UPDATE USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  ));

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;
