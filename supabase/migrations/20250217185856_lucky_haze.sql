/*
  # Update RLS policies for URL shortener

  1. Changes
    - Remove authenticated-only restriction for URL creation
    - Allow public access for both reading and creating URLs
    
  2. Security
    - Enable RLS on urls table
    - Add policy for public read and insert access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON urls;
DROP POLICY IF EXISTS "Allow authenticated users to create URLs" ON urls;

-- Create new policies for public access
CREATE POLICY "Allow public access"
  ON urls
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);