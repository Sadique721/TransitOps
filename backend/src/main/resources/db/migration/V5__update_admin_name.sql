-- =====================================================================
-- V5__update_admin_name.sql
-- Update the seeded admin user's name to 'Md Sadique Amin'
-- =====================================================================

UPDATE users 
SET name = 'Md Sadique Amin' 
WHERE email = 'entitykart@gmail.com';
