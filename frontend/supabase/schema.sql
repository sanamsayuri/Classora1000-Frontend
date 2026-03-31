-- Supabase SQL Schema for SchoolSaaS Auth & Approval

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create the custom users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'staff',
  organization_name TEXT DEFAULT '',
  approved BOOLEAN DEFAULT FALSE,
  is_super_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Turn on Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Users can view their own data
CREATE POLICY "Users can view own data" 
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Super Admins can view all data
CREATE POLICY "Super Admins can view all data" 
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_super_admin = true
    )
  );

-- Function to check and enforce updates to protected fields
CREATE OR REPLACE FUNCTION public.check_user_updates()
RETURNS TRIGGER AS $$
BEGIN
  -- If not a super admin, block updates to "approved" or "is_super_admin"
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_super_admin = true) THEN
    IF NEW.approved IS DISTINCT FROM OLD.approved THEN
      RAISE EXCEPTION 'Only super admins can update approval status';
    END IF;
    IF NEW.is_super_admin IS DISTINCT FROM OLD.is_super_admin THEN
      RAISE EXCEPTION 'Only super admins can update super admin status';
    END IF;
  END IF;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for user updates
DROP TRIGGER IF EXISTS enforce_update_permissions ON public.users;
CREATE TRIGGER enforce_update_permissions
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_user_updates();

-- Users can update their own data
CREATE POLICY "Users can update own data" 
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Super Admins can update any user's data
CREATE POLICY "Super Admins can update any data" 
  ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_super_admin = true
    )
  );

-- Super Admins can delete users
CREATE POLICY "Super Admins can delete any data" 
  ON public.users
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND is_super_admin = true
    )
  );


-- 4. Trigger to create user in public.users on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- We assume 'superadmin@example.com' is the explicit single super admin
  INSERT INTO public.users (id, email, full_name, role, organization_name, approved, is_super_admin)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Unknown User'),
    'staff', -- We leave this as a basic default until they finish onboarding
    '',
    CASE WHEN NEW.email = 'superadmin@example.com' THEN true ELSE false END,
    CASE WHEN NEW.email = 'superadmin@example.com' THEN true ELSE false END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

