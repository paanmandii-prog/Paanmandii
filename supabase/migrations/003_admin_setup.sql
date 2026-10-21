-- ============================================================
-- PAAN MANDI — First Admin Provisioning Script
-- Migration: 003_admin_setup.sql
-- ============================================================
-- RUN THIS MANUALLY after creating your first admin user
-- in the Supabase Auth dashboard.
--
-- USAGE:
--   1. Go to Supabase Dashboard → Authentication → Users
--   2. Create a user with your admin email and a strong password
--   3. Copy the user's UUID
--   4. Replace 'YOUR-ADMIN-USER-UUID-HERE' below with the actual UUID
--   5. Run this script in the Supabase SQL Editor
-- ============================================================

-- STEP 1: Replace this UUID with your actual admin user ID
-- DO NOT run with the placeholder UUID.

DO $$
DECLARE
  v_admin_id UUID := 'YOUR-ADMIN-USER-UUID-HERE';  -- <<< REPLACE THIS
BEGIN
  -- Verify the user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_admin_id) THEN
    RAISE EXCEPTION 'User % not found. Create the user in Supabase Auth first.', v_admin_id;
  END IF;

  -- Check it's not already the placeholder
  IF v_admin_id::TEXT = 'YOUR-ADMIN-USER-UUID-HERE' THEN
    RAISE EXCEPTION 'You must replace the placeholder UUID with your actual admin user UUID.';
  END IF;

  -- Update the user role from 'customer' to 'admin'
  UPDATE user_roles
  SET role = 'super_admin'
  WHERE user_id = v_admin_id;

  -- If no role row exists yet, insert it
  IF NOT FOUND THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (v_admin_id, 'super_admin');
  END IF;

  RAISE NOTICE 'Admin role granted to user %', v_admin_id;
END;
$$;
