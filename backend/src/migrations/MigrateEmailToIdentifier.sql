-- Migration: Copy email to identifier for existing users
-- This ensures existing users can still login with their email

UPDATE users
SET identifier = email,
    "identifierType" = 'email'
WHERE email IS NOT NULL
  AND identifier IS NULL;

-- Ensure no null identifiers
UPDATE users
SET identifier = CONCAT('user_', id)
WHERE identifier IS NULL;
