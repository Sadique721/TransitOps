package com.transitops.config;

import com.transitops.entity.*;
import com.transitops.enums.*;
import com.transitops.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final MaintenanceLogRepository maintenanceLogRepository;
    private final ExpenseRepository expenseRepository;
    private final PasswordEncoder passwordEncoder;

    private static final int TARGET_COUNT = 150;

    @Override
    public void run(String... args) {
        seedCoreUsers();
        seedUsersLargeBatch();
        seedVehiclesLargeBatch();
        seedDriversLargeBatch();
        seedTripsLargeBatch();
        seedMaintenanceLargeBatch();
        seedExpensesLargeBatch();
    }

    private void seedCoreUsers() {
        seedUser("Md Sadique Amin", "entitykart@gmail.com", "Amin@123", Role.ADMIN);
        seedUser("Super Admin", "admin@transitops.com", "Amin@123", Role.ADMIN);
        seedUser("Driver Alex", "driver@transitops.com", "Amin@123", Role.DRIVER);
        seedUser("Safety Officer Sara", "safety@transitops.com", "Amin@123", Role.SAFETY_OFFICER);
        seedUser("Financial Analyst Frank", "finance@transitops.com", "Amin@123", Role.FINANCIAL_ANALYST);
    }

    private void seedUser(String name, String email, String rawPassword, Role role) {
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .build();
            userRepository.save(user);
        }
    }

    private void seedUsersLargeBatch() {
        if (userRepository.count() < TARGET_COUNT) {
            String encodedPass = passwordEncoder.encode("Amin@123");
            String[] firstNames = {"Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Reyansh", "Krishna", "Ishaan", "Shaurya", "Atharv", "Ananya", "Diya", "Gauri", "Kavya", "Pooja", "Riya", "Rajesh", "Suresh", "Vikram", "Rohan"};
            String[] lastNames = {"Sharma", "Verma", "Patel", "Gupta", "Singh", "Yadav", "Joshi", "Mehta", "Nair", "Kapoor", "Khan", "Reddy", "Deshmukh", "Chauhan", "Agarwal"};
            Role[] roles = {Role.DRIVER, Role.DRIVER, Role.DRIVER, Role.FLEET_MANAGER, Role.SAFETY_OFFICER, Role.FINANCIAL_ANALYST};

            List<User> users = new ArrayList<>();
            for (int i = 1; i <= TARGET_COUNT; i++) {
                String email = "operator." + i + "@transitops.com";
                if (!userRepository.existsByEmail(email)) {
                    String name = firstNames[i % firstNames.length] + " " + lastNames[(i * 3) % lastNames.length];
                    User u = User.builder()
                            .name(name)
                            .email(email)
                            .password(encodedPass)
                            .role(roles[i % roles.length])
                            .mfaEnabled(i % 5 == 0)
                            .active(i % 30 != 0)
                            .build();
                    users.add(u);
                }
            }
            if (!users.isEmpty()) {
                userRepository.saveAll(users);
                log.info("Seeded large user batch. Total users now: {}", userRepository.count());
            }
        }
    }

    private void seedVehiclesLargeBatch() {
        if (vehicleRepository.count() < TARGET_COUNT) {
            String[] models = {"Tata Prima 4928.S", "Ashok Leyland AVTR 4220", "BharatBenz 3528C Heavy", "Mahindra Blazo X 35", "Eicher Pro 6035 Cargo", "Volvo FH16 Globetrotter", "Scania R500 V8 Streamline", "Mercedes-Benz Actros 3340", "Tata Ace Gold EV", "Mahindra Bolero Maxi Truck", "Ashok Leyland Dost+", "Force Traveller Delivery", "Isuzu D-Max Super Strong"};
            VehicleType[] types = {VehicleType.TRUCK, VehicleType.TRUCK, VehicleType.TRUCK, VehicleType.TRUCK, VehicleType.TRUCK, VehicleType.TRUCK, VehicleType.TRUCK, VehicleType.TRUCK, VehicleType.VAN, VehicleType.VAN, VehicleType.VAN, VehicleType.VAN, VehicleType.VAN};
            double[] capacities = {28000.0, 24000.0, 22000.0, 20000.0, 25000.0, 32000.0, 30000.0, 26000.0, 1200.0, 1800.0, 2200.0, 3500.0, 2500.0};
            VehicleStatus[] statuses = {VehicleStatus.AVAILABLE, VehicleStatus.AVAILABLE, VehicleStatus.AVAILABLE, VehicleStatus.ON_TRIP, VehicleStatus.ON_TRIP, VehicleStatus.MAINTENANCE, VehicleStatus.RETIRED};
            String[] regions = {"North Zone - Delhi NCR", "West Zone - Mumbai MH", "South Zone - Bangalore KA", "East Zone - Kolkata WB", "Central Zone - Nagpur MP"};
            String[] stateCodes = {"MH-12", "DL-01", "KA-03", "TN-02", "TS-07", "GJ-01", "HR-26", "WB-02", "UP-32", "RJ-14"};
            String[] seriesList = {"AB", "CD", "EF", "GH", "JK", "MN", "PQ", "RS", "TU", "XY"};

            List<Vehicle> vehicles = new ArrayList<>();
            for (int i = 1; i <= TARGET_COUNT; i++) {
                String reg = stateCodes[i % 10] + "-" + seriesList[(i / 15) % 10] + "-" + (1000 + i);
                if (!vehicleRepository.existsByRegistrationNumber(reg)) {
                    int modelIdx = i % models.length;
                    double odo = 5000.0 + (i * 1240.5);
                    BigDecimal cost = BigDecimal.valueOf(1500000.0 + (i * 35000.0));
                    Vehicle v = Vehicle.builder()
                            .registrationNumber(reg)
                            .name(models[modelIdx] + " #" + i)
                            .model(models[modelIdx])
                            .type(types[modelIdx])
                            .maxLoadCapacity(capacities[modelIdx])
                            .odometer(odo)
                            .acquisitionCost(cost)
                            .region(regions[i % regions.length])
                            .status(statuses[i % statuses.length])
                            .qrCode("QR-" + reg.replace("-", ""))
                            .build();
                    vehicles.add(v);
                }
            }
            if (!vehicles.isEmpty()) {
                vehicleRepository.saveAll(vehicles);
                log.info("Seeded large vehicles batch. Total vehicles now: {}", vehicleRepository.count());
            }
        }
    }

    private void seedDriversLargeBatch() {
        if (driverRepository.count() < TARGET_COUNT) {
            String[] firstNames = {"Rajesh", "Suresh", "Amit", "Vijay", "Anil", "Sanjay", "Deepak", "Pankaj", "Vikram", "Rohan", "Sunil", "Karan", "Arjun", "Kabir", "Rahul", "Manish", "Rohit", "Hardik", "Jasprit", "Mohammed"};
            String[] lastNames = {"Kumar", "Sharma", "Patel", "Yadav", "Gupta", "Verma", "Joshi", "Singh", "Mehta", "Nair", "Johar", "Kapoor", "Khan", "Bose", "Paul", "Pandya", "Bumrah", "Shami", "Chahal", "Ashwin"};
            String[] categories = {"Heavy Commercial (HMV)", "Medium Freight (MGV)", "Light Commercial (LCV)", "Hazardous Chemical / Tanker", "Container Transport"};
            DriverStatus[] statuses = {DriverStatus.AVAILABLE, DriverStatus.AVAILABLE, DriverStatus.AVAILABLE, DriverStatus.ON_TRIP, DriverStatus.ON_TRIP, DriverStatus.SUSPENDED};

            List<Driver> drivers = new ArrayList<>();
            for (int i = 1; i <= TARGET_COUNT; i++) {
                String lic = "DL-142024" + (100000 + i);
                if (!driverRepository.existsByLicenseNumber(lic)) {
                    String name = firstNames[i % firstNames.length] + " " + lastNames[(i * 2) % lastNames.length];
                    int safety = 70 + (i % 31);
                    Driver d = Driver.builder()
                            .name(name)
                            .licenseNumber(lic)
                            .licenseCategory(categories[i % categories.length])
                            .licenseExpiryDate(LocalDate.now().plusMonths(6 + (i % 36)))
                            .contactNumber("+91 98" + String.format("%08d", (10000000 + i * 4927) % 100000000))
                            .status(statuses[i % statuses.length])
                            .safetyScore(safety)
                            .build();
                    drivers.add(d);
                }
            }
            if (!drivers.isEmpty()) {
                driverRepository.saveAll(drivers);
                log.info("Seeded large drivers batch. Total drivers now: {}", driverRepository.count());
            }
        }
    }

    private void seedTripsLargeBatch() {
        if (tripRepository.count() < TARGET_COUNT) {
            List<Vehicle> allVehicles = vehicleRepository.findAll();
            List<Driver> allDrivers = driverRepository.findAll();
            if (allVehicles.isEmpty() || allDrivers.isEmpty()) return;

            String[] cities = {"Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Nagpur", "Indore", "Bhopal", "Patna", "Vadodara", "Nashik", "Varanasi", "Ranchi", "Coimbatore"};
            TripStatus[] statuses = {TripStatus.COMPLETED, TripStatus.COMPLETED, TripStatus.COMPLETED, TripStatus.DISPATCHED, TripStatus.DRAFT, TripStatus.CANCELLED};

            List<Trip> trips = new ArrayList<>();
            for (int i = 1; i <= TARGET_COUNT; i++) {
                String tNum = "TR-" + (20000 + i);
                if (!tripRepository.existsByTripNumber(tNum)) {
                    String src = cities[i % cities.length] + " Cargo Hub";
                    String dst = cities[(i * 7) % cities.length] + " Logistics Depot";
                    double weight = 2000.0 + ((i % 25) * 800.0);
                    double dist = 120.0 + ((i % 40) * 35.0);
                    TripStatus status = statuses[i % statuses.length];
                    boolean isCompleted = (status == TripStatus.COMPLETED);
                    double expFuel = Math.round((dist / 4.2) * 10.0) / 10.0;
                    boolean theft = (i % 11 == 0 && isCompleted);
                    double actFuel = theft ? Math.round((expFuel * 1.35) * 10.0) / 10.0 : Math.round((expFuel * (0.95 + ((i % 10) * 0.01))) * 10.0) / 10.0;
                    double deviation = isCompleted ? Math.round((((actFuel - expFuel) / expFuel) * 100.0) * 10.0) / 10.0 : 0.0;
                    BigDecimal rev = BigDecimal.valueOf(dist * 45.0 + weight * 1.5);
                    Vehicle v = allVehicles.get(i % allVehicles.size());
                    Driver d = allDrivers.get((i * 2) % allDrivers.size());

                    Trip trip = Trip.builder()
                            .tripNumber(tNum)
                            .source(src)
                            .destination(dst)
                            .cargoWeight(weight)
                            .plannedDistance(dist)
                            .finalOdometer(isCompleted ? (40000.0 + i * 500.0 + dist) : null)
                            .expectedFuelConsumed(expFuel)
                            .fuelConsumed(isCompleted ? actFuel : null)
                            .fuelDeviationPercent(deviation)
                            .fuelTheftSuspected(theft)
                            .revenue(rev)
                            .status(status)
                            .vehicle(v)
                            .driver(d)
                            .dispatchedAt(isCompleted || status == TripStatus.DISPATCHED ? LocalDateTime.now().minusDays(i) : null)
                            .completedAt(isCompleted ? LocalDateTime.now().minusDays(i).plusHours(12) : null)
                            .build();
                    trips.add(trip);
                }
            }
            if (!trips.isEmpty()) {
                tripRepository.saveAll(trips);
                log.info("Seeded large trips batch. Total trips now: {}", tripRepository.count());
            }
        }
    }

    private void seedMaintenanceLargeBatch() {
        if (maintenanceLogRepository.count() < TARGET_COUNT) {
            List<Vehicle> allVehicles = vehicleRepository.findAll();
            if (allVehicles.isEmpty()) return;

            String[] descriptions = {
                    "Routine 40,000 km general service, engine oil & filter replacement",
                    "Brake pads overhaul and hydraulic fluid flush",
                    "Air compressor and turbocharger intercooler inspection",
                    "Transmission gearbox fluid renewal and clutch adjustment",
                    "Steering alignment, tie-rod inspection and tyre balancing",
                    "Suspension leaf-spring rebushing and shock absorber check",
                    "Alternator and heavy-duty 24V battery diagnostic replacement",
                    "DEF / AdBlue dosing system calibration and DPF filter clean",
                    "Radiator coolant flush and thermostat valve replacement",
                    "Differential oil change and axle seal inspection"
            };

            List<MaintenanceLog> logs = new ArrayList<>();
            for (int i = 1; i <= TARGET_COUNT; i++) {
                Vehicle v = allVehicles.get(i % allVehicles.size());
                String desc = descriptions[i % descriptions.length] + " [Service Batch #" + i + "]";
                BigDecimal cost = BigDecimal.valueOf(3500.0 + ((i % 20) * 1450.0));
                LocalDate mDate = LocalDate.now().minusDays(i * 2L);
                boolean isActive = (i % 12 == 0);

                MaintenanceLog logEntry = MaintenanceLog.builder()
                        .vehicle(v)
                        .description(desc)
                        .cost(cost)
                        .maintenanceDate(mDate)
                        .isActive(isActive)
                        .build();
                logs.add(logEntry);
            }
            if (!logs.isEmpty()) {
                maintenanceLogRepository.saveAll(logs);
                log.info("Seeded large maintenance batch. Total maintenance logs now: {}", maintenanceLogRepository.count());
            }
        }
    }

    private void seedExpensesLargeBatch() {
        if (expenseRepository.count() < TARGET_COUNT) {
            List<Vehicle> allVehicles = vehicleRepository.findAll();
            List<Trip> allTrips = tripRepository.findAll();
            if (allVehicles.isEmpty()) return;

            ExpenseType[] types = {ExpenseType.FUEL, ExpenseType.TOLL, ExpenseType.MAINTENANCE, ExpenseType.OTHER};
            List<Expense> expenses = new ArrayList<>();

            for (int i = 1; i <= TARGET_COUNT; i++) {
                Vehicle v = allVehicles.get(i % allVehicles.size());
                Trip t = allTrips.isEmpty() ? null : allTrips.get(i % allTrips.size());
                ExpenseType type = types[i % types.length];
                Double liters = (type == ExpenseType.FUEL) ? (45.0 + ((i % 15) * 12.0)) : null;
                BigDecimal cost = (type == ExpenseType.FUEL)
                        ? BigDecimal.valueOf(liters * 94.5)
                        : BigDecimal.valueOf(500.0 + ((i % 10) * 350.0));
                LocalDate date = LocalDate.now().minusDays(i);

                Expense exp = Expense.builder()
                        .vehicle(v)
                        .trip(t)
                        .type(type)
                        .liters(liters)
                        .cost(cost)
                        .date(date)
                        .build();
                expenses.add(exp);
            }
            if (!expenses.isEmpty()) {
                expenseRepository.saveAll(expenses);
                log.info("Seeded large expenses batch. Total expenses now: {}", expenseRepository.count());
            }
        }
    }
}
