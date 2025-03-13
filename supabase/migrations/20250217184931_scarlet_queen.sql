/*
  # Create URLs table for URL shortener

  1. New Tables
    - `urls`
      - `id` (uuid, primary key)
      - `original_url` (text, not null)
      - `short_code` (text, unique, not null)
      - `created_at` (timestamp with timezone)
      - `clicks` (integer, default 0)

  2. Security
    - Enable RLS on `urls` table
    - Add policy for public read access
    - Add policy for authenticated users to create URLs
*/

CREATE TABLE IF NOT EXISTS urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_url text NOT NULL,
  short_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  clicks integer DEFAULT 0
);

ALTER TABLE urls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON urls
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to create URLs"
  ON urls
  FOR INSERT
  TO authenticated
  WITH CHECK (true);