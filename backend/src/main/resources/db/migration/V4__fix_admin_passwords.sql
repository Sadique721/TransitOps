-- =====================================================================
-- V4__fix_admin_passwords.sql
-- Force update hashed passwords of default seed users to match 'Amin@123'
-- =====================================================================

UPDATE users 
SET password = '$2a$10$SUWp4wRLC.8mFpewRZIXnuRaCtBGiicl7SiRr2SYFAgNb6lR3A1C6'
WHERE email IN ('entitykart@gmail.com', 'driver@transitops.com');
