/*
  # Fix profiles RLS policies

  1. Changes
     - Fix the INSERT policy for profiles table to properly allow users to create their own profile
     - Add explicit check for auth.uid() = id in the WITH CHECK clause
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create a corrected INSERT policy
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Ensure the profiles table has proper RLS enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;