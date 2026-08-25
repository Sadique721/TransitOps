package com.transitops.service;

import com.transitops.dto.response.DashboardResponse;
import com.transitops.entity.Expense;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.enums.DriverStatus;
import com.transitops.enums.TripStatus;
import com.transitops.enums.VehicleStatus;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.ExpenseRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final ExpenseRepository expenseRepository;

    public DashboardResponse dashboard() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        long total = vehicles.size();
        long available = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.AVAILABLE).count();
        long onTrip = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.ON_TRIP).count();
        long inShop = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.MAINTENANCE).count();
        long retired = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.RETIRED).count();

        long activeTrips = tripRepository.findByStatus(TripStatus.DISPATCHED).size();
        long pendingTrips = tripRepository.findByStatus(TripStatus.DRAFT).size();

        long driversOnDuty = driverRepository.findByStatus(DriverStatus.ON_TRIP).size();
        long driversAvailable = driverRepository.findByStatus(DriverStatus.AVAILABLE).size();

        // Utilization = vehicles currently On Trip / non-retired fleet
        long activeFleet = total - retired;
        double utilization = activeFleet == 0 ? 0.0 : (onTrip * 100.0) / activeFleet;

        return DashboardResponse.builder()
                .totalVehicles(total)
                .availableVehicles(available)
                .onTripVehicles(onTrip)
                .inShopVehicles(inShop)
                .retiredVehicles(retired)
                .activeTrips(activeTrips)
                .pendingTrips(pendingTrips)
                .driversOnDuty(driversOnDuty)
                .driversAvailable(driversAvailable)
                .fleetUtilizationPercent(Math.round(utilization * 100.0) / 100.0)
                .build();
    }

    // Fuel Efficiency = total planned distance / total fuel consumed, per vehicle
    public Map<String, Double> fuelEfficiencyPerVehicle() {
        List<Trip> completedTrips = tripRepository.findByStatus(TripStatus.COMPLETED);
        return completedTrips.stream()
                .filter(t -> t.getFuelConsumed() != null && t.getFuelConsumed() > 0)
                .collect(Collectors.groupingBy(
                        t -> t.getVehicle().getRegistrationNumber(),
                        Collectors.averagingDouble(t ->
                                (t.getPlannedDistance() != null ? t.getPlannedDistance() : 0.0) / t.getFuelConsumed())
                ));
    }

    // Operational cost per vehicle = sum(fuel expenses) + sum(maintenance expenses)
    public Map<String, BigDecimal> operationalCostPerVehicle() {
        List<Expense> expenses = expenseRepository.findAll();
        return expenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getVehicle().getRegistrationNumber(),
                        Collectors.reducing(BigDecimal.ZERO, Expense::getCost, BigDecimal::add)
                ));
    }

    // ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
    public double vehicleRoi(Vehicle vehicle, BigDecimal totalRevenue, BigDecimal totalMaintenanceAndFuel) {
        if (vehicle.getAcquisitionCost() == null || vehicle.getAcquisitionCost().compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }
        BigDecimal netProfit = totalRevenue.subtract(totalMaintenanceAndFuel);
        return netProfit.divide(vehicle.getAcquisitionCost(), 4, java.math.RoundingMode.HALF_UP).doubleValue();
    }
}
