-- =====================================================================
-- V3__demo_records.sql
-- Seed data for TransitOps Enterprise Fleet Management System
-- =====================================================================

-- 1. Insert default users
-- Hashed password for both accounts is 'Amin@123' (BCrypt)
INSERT INTO users (name, email, password, role, refresh_token, mfa_enabled, active, created_at, updated_at, tenant_id)
VALUES 
('Admin Manager', 'entitykart@gmail.com', '$2a$10$wBsk4e4qXwB62aH6V76VTe5o558l.x6Pq04r.1.6h.4wHlI0nB8uC', 'FLEET_MANAGER', NULL, FALSE, TRUE, '2024-05-29 08:00:00', '2024-05-29 08:00:00', 'public'),
('Michael Driver', 'driver@transitops.com', '$2a$10$wBsk4e4qXwB62aH6V76VTe5o558l.x6Pq04r.1.6h.4wHlI0nB8uC', 'DRIVER', NULL, FALSE, TRUE, '2024-05-29 08:00:00', '2024-05-29 08:00:00', 'public')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert default vehicles
INSERT INTO vehicles (id, registration_number, name, model, type, max_load_capacity, odometer, acquisition_cost, qr_code, status, region, created_at, updated_at, tenant_id)
VALUES
(1, 'AL-223965406', 'Polestar 520 DDS', 'Polestar V2024', 'TRUCK', 8500.0, 486.0, 85000.00, 'QR-AL520', 'AVAILABLE', 'Tallinn', '2024-05-29 08:00:00', '2024-05-29 08:00:00', 'public'),
(2, 'YR-34DFR734W2', 'Noah Car', 'Toyota Noah 2023', 'CAR', 1200.0, 120.0, 25000.00, 'QR-YR023', 'AVAILABLE', 'Kyiv', '2024-05-29 08:00:00', '2024-05-29 08:00:00', 'public'),
(3, 'TR-99ABC12345', 'Peterbilt Trucks', 'Peterbilt 389', 'TRUCK', 15000.0, 15200.0, 120000.00, 'QR-TR389', 'AVAILABLE', 'Rivne', '2024-05-29 08:00:00', '2024-05-29 08:00:00', 'public')
ON CONFLICT (registration_number) DO NOTHING;

-- 3. Insert default drivers
INSERT INTO drivers (id, name, license_number, license_category, license_expiry_date, contact_number, safety_score, status, created_at, updated_at, tenant_id)
VALUES
(1, 'Carole Chimako', 'LIC928523', 'CLASS_A', '2028-12-31', '+372-555-0199', 92, 'AVAILABLE', '2024-05-29 08:00:00', '2024-05-29 08:00:00', 'public'),
(2, 'Michael Johnson', 'LIC1241AA41', 'CLASS_A', '2027-10-28', '+380-50-123-4567', 88, 'AVAILABLE', '2024-05-29 08:00:00', '2024-05-29 08:00:00', 'public'),
(3, 'Millie Fernandez', 'LIC928524', 'CLASS_B', '2029-06-15', '+372-555-0200', 95, 'AVAILABLE', '2024-05-29 08:00:00', '2024-05-29 08:00:00', 'public'),
(4, 'Riley Cooper', 'LIC928525', 'CLASS_A', '2027-09-01', '+372-555-0201', 90, 'AVAILABLE', '2024-05-29 08:00:00', '2024-05-29 08:00:00', 'public')
ON CONFLICT (license_number) DO NOTHING;

-- 4. Insert default trips
INSERT INTO trips (id, trip_number, source, destination, cargo_weight, planned_distance, final_odometer, fuel_consumed, expected_fuel_consumed, fuel_deviation_percent, fuel_theft_suspected, revenue, status, vehicle_id, driver_id, dispatched_at, completed_at, created_at, updated_at, tenant_id)
VALUES
(1, 'TRIP-001', 'Kyiv', 'Rivne', 5200.0, 120.0, 486.0, 35.0, 30.0, 16.67, FALSE, 1500.00, 'COMPLETED', 1, 2, '2024-05-29 09:00:00', '2024-05-29 10:50:00', '2024-05-29 08:30:00', '2024-05-29 10:50:00', 'public'),
(2, 'TRIP-002', 'Tallinn', 'Narva', 8000.0, 210.0, NULL, NULL, NULL, NULL, FALSE, 2500.00, 'DRAFT', 3, 1, NULL, NULL, '2024-05-29 08:30:00', '2024-05-29 08:30:00', 'public')
ON CONFLICT (trip_number) DO NOTHING;

-- 5. Insert default expenses
INSERT INTO expenses (id, trip_id, vehicle_id, type, liters, cost, date, created_at, updated_at, tenant_id)
VALUES
(1, 1, 1, 'FUEL', 35.0, 500.00, '2024-05-29', '2024-05-29 10:50:00', '2024-05-29 10:50:00', 'public'),
(2, NULL, 1, 'MAINTENANCE', NULL, 400.00, '2024-05-29', '2024-05-29 11:00:00', '2024-05-29 11:00:00', 'public')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert default maintenance records
INSERT INTO maintenance_logs (id, vehicle_id, description, cost, maintenance_date, is_active, created_at, updated_at, tenant_id)
VALUES
(1, 2, 'Scheduled 50k engine check and oil filters change.', 250.00, '2024-05-29', FALSE, '2024-05-29 08:00:00', '2024-05-29 11:00:00', 'public')
ON CONFLICT (id) DO NOTHING;
