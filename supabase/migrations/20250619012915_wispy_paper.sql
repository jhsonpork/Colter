/*
  # Fix profile loading issues

  1. Changes
     - Ensure the trigger function is properly defined
     - Make sure the trigger is correctly attached to auth.users
     - Add a function to check and create profiles if they don't exist
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an improved trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, created_at)
  VALUES (new.id, now())
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure all existing users have profiles
DO $$
DECLARE
  user_rec RECORD;
BEGIN
  FOR user_rec IN SELECT id FROM auth.users LOOP
    INSERT INTO public.profiles (id, created_at)
    VALUES (user_rec.id, now())
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END;
$$;