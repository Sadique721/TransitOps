package com.transitops.service;

import com.transitops.dto.response.ChatResponse;
import com.transitops.dto.response.DriverPerformanceResponse;
import com.transitops.dto.response.VehicleHealthResponse;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.enums.DriverStatus;
import com.transitops.enums.VehicleStatus;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

/**
 * Module 9 — "AI Fleet Assistant" (basic version).
 *
 * Honest scope note: this is NOT an LLM. There's no external AI API wired up
 * (that would need a model + an API key this environment doesn't have).
 * What this actually is: a small, real, working rule-based intent matcher —
 * it recognises a fixed set of question *patterns* by keyword, runs a real
 * query against the live database for each one, and answers in a sentence.
 * It genuinely answers real questions about real data (that part isn't
 * faked), it just can't handle arbitrary free-form phrasing the way a real
 * LLM integration would. Swapping this for a real LLM later just means
 * replacing `answer()`'s dispatch logic with a call to a hosted model that
 * has these same repositories exposed as tools/functions.
 */
@Service
@RequiredArgsConstructor
public class AiAssistantService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final FuelIntelligenceService fuelIntelligenceService;
    private final DriverPerformanceService driverPerformanceService;
    private final VehicleHealthService vehicleHealthService;

    public ChatResponse answer(String rawQuery) {
        String q = rawQuery.toLowerCase(Locale.ROOT).trim();

        if (containsAny(q, "idle vehicle", "vehicles idle", "vehicles available", "available vehicle")) {
            return respond("VEHICLES_AVAILABLE_COUNT",
                    countVehicles(VehicleStatus.AVAILABLE) + " vehicles are currently Available.");
        }
        if (containsAny(q, "vehicles on trip", "vehicle on trip", "vehicles are on trip")) {
            return respond("VEHICLES_ON_TRIP_COUNT",
                    countVehicles(VehicleStatus.ON_TRIP) + " vehicles are currently On Trip.");
        }
        if (containsAny(q, "in shop", "in maintenance", "vehicles under maintenance")) {
            return respond("VEHICLES_IN_SHOP_COUNT",
                    countVehicles(VehicleStatus.MAINTENANCE) + " vehicles are currently In Shop.");
        }
        if (containsAny(q, "retired vehicle")) {
            return respond("VEHICLES_RETIRED_COUNT",
                    countVehicles(VehicleStatus.RETIRED) + " vehicles have been Retired.");
        }
        if (containsAny(q, "how many vehicles", "total vehicles", "fleet size")) {
            return respond("VEHICLES_TOTAL_COUNT",
                    "The fleet has " + vehicleRepository.count() + " vehicles in total.");
        }

        if (containsAny(q, "drivers available", "available driver")) {
            return respond("DRIVERS_AVAILABLE_COUNT",
                    countDrivers(DriverStatus.AVAILABLE) + " drivers are currently Available.");
        }
        if (containsAny(q, "drivers on trip", "driver on trip")) {
            return respond("DRIVERS_ON_TRIP_COUNT",
                    countDrivers(DriverStatus.ON_TRIP) + " drivers are currently On Trip.");
        }
        if (containsAny(q, "suspended driver")) {
            return respond("DRIVERS_SUSPENDED_COUNT",
                    countDrivers(DriverStatus.SUSPENDED) + " drivers are currently Suspended.");
        }
        if (containsAny(q, "how many drivers", "total drivers")) {
            return respond("DRIVERS_TOTAL_COUNT",
                    "There are " + driverRepository.count() + " drivers registered in total.");
        }

        if (containsAny(q, "top driver", "best driver", "highest ranked driver")) {
            List<DriverPerformanceResponse> leaderboard = driverPerformanceService.leaderboard();
            if (leaderboard.isEmpty()) {
                return respond("TOP_DRIVER", "There are no drivers to rank yet.");
            }
            DriverPerformanceResponse top = leaderboard.get(0);
            return respond("TOP_DRIVER", String.format(
                    "%s is currently the top-ranked driver with an overall score of %.1f/100 (%d completed trips).",
                    top.getDriverName(), top.getOverallScore(), top.getCompletedTrips()));
        }

        if (containsAny(q, "trips today")) {
            long tripsToday = tripRepository.findAll().stream()
                    .filter(t -> t.getCreatedAt() != null && t.getCreatedAt().toLocalDate().isEqual(LocalDate.now()))
                    .count();
            return respond("TRIPS_TODAY_COUNT", tripsToday + " trips were created today.");
        }
        if (containsAny(q, "how many trips", "total trips")) {
            return respond("TRIPS_TOTAL_COUNT", "There are " + tripRepository.count() + " trips in total.");
        }

        if (containsAny(q, "fuel theft", "suspicious fuel", "fuel fraud")) {
            List<Trip> flagged = fuelIntelligenceService.findSuspectedTheftTrips();
            if (flagged.isEmpty()) {
                return respond("FUEL_THEFT_ALERTS", "No trips are currently flagged for suspected fuel theft.");
            }
            String tripNumbers = flagged.stream().limit(5).map(Trip::getTripNumber)
                    .reduce((a, b) -> a + ", " + b).orElse("");
            return respond("FUEL_THEFT_ALERTS", flagged.size()
                    + " trip(s) are flagged for suspected fuel theft, e.g.: " + tripNumbers + ".");
        }
        if (containsAny(q, "fuel efficiency", "average mileage", "km per liter", "km/l")) {
            List<Vehicle> vehicles = vehicleRepository.findAll();
            double sum = 0;
            int counted = 0;
            for (Vehicle v : vehicles) {
                var avg = fuelIntelligenceService.averageKmPerLiterForVehicle(v.getId());
                if (avg.isPresent()) {
                    sum += avg.get();
                    counted++;
                }
            }
            if (counted == 0) {
                return respond("FLEET_FUEL_EFFICIENCY",
                        "Not enough completed-trip history yet to calculate fleet-wide fuel efficiency.");
            }
            return respond("FLEET_FUEL_EFFICIENCY", String.format(
                    "Across %d vehicles with enough history, the fleet averages %.2f km/liter.",
                    counted, sum / counted));
        }

        if (containsAny(q, "need maintenance", "vehicle health", "unhealthy vehicle")) {
            List<com.transitops.dto.response.VehicleHealthResponse> unhealthy = vehicleRepository.findAll().stream()
                    .filter(v -> v.getStatus() != VehicleStatus.RETIRED)
                    .map(v -> vehicleHealthService.computeHealthScore(v.getId()))
                    .filter(h -> h.getOverallScore() < 70)
                    .sorted(Comparator.comparingDouble(com.transitops.dto.response.VehicleHealthResponse::getOverallScore))
                    .toList();
            if (unhealthy.isEmpty()) {
                return respond("VEHICLES_NEED_MAINTENANCE", "All active vehicles currently have a healthy score (70+).");
            }
            String regs = unhealthy.stream().limit(5).map(VehicleHealthResponse::getRegistrationNumber)
                    .reduce((a, b) -> a + ", " + b).orElse("");
            return respond("VEHICLES_NEED_MAINTENANCE", unhealthy.size()
                    + " vehicle(s) have a health score below 70 and should be inspected, e.g.: " + regs + ".");
        }

        return respond("UNRECOGNIZED",
                "I can currently answer questions about: vehicle/driver counts and status, today's trip count, "
                        + "top driver ranking, fleet fuel efficiency, fuel-theft alerts, and vehicles needing maintenance. "
                        + "Try rephrasing your question using one of those topics.");
    }

    private ChatResponse respond(String intent, String answer) {
        return ChatResponse.builder().matchedIntent(intent).answer(answer).build();
    }

    private long countVehicles(VehicleStatus status) {
        return vehicleRepository.findByStatus(status).size();
    }

    private long countDrivers(DriverStatus status) {
        return driverRepository.findByStatus(status).size();
    }

    private boolean containsAny(String text, String... needles) {
        for (String n : needles) {
            if (text.contains(n)) return true;
        }
        return false;
    }
}
