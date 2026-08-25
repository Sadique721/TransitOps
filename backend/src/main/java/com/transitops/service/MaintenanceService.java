package com.transitops.service;

import com.transitops.dto.request.MaintenanceRequest;
import com.transitops.entity.MaintenanceLog;
import com.transitops.entity.Vehicle;
import com.transitops.enums.VehicleStatus;
import com.transitops.exception.BusinessRuleException;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.repository.MaintenanceLogRepository;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceLogRepository maintenanceLogRepository;
    private final VehicleRepository vehicleRepository;
    private final AuditLogService auditLogService;
    private final EmailService emailService;

    // PDF Rule #5 / Section 4.1: creating an active maintenance record
    // automatically switches the vehicle to In Shop, locking it out of dispatch.
    @Transactional
    public MaintenanceLog create(MaintenanceRequest request) {
        Vehicle vehicle = vehicleRepository.findByIdForUpdate(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + request.getVehicleId()));

        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new BusinessRuleException("Cannot open maintenance for a vehicle that is currently On Trip");
        }
        if (vehicle.getStatus() == VehicleStatus.RETIRED) {
            throw new BusinessRuleException("Cannot open maintenance for a Retired vehicle");
        }
        if (maintenanceLogRepository.findByVehicleIdAndIsActiveTrue(vehicle.getId()).isPresent()) {
            throw new BusinessRuleException("Vehicle already has an active maintenance record");
        }

        MaintenanceLog log = MaintenanceLog.builder()
                .vehicle(vehicle)
                .description(request.getDescription())
                .cost(request.getCost())
                .maintenanceDate(request.getMaintenanceDate() != null ? request.getMaintenanceDate() : LocalDate.now())
                .isActive(true)
                .build();

        MaintenanceLog saved = maintenanceLogRepository.save(log);

        VehicleStatus old = vehicle.getStatus();
        vehicle.setStatus(VehicleStatus.MAINTENANCE);
        vehicleRepository.save(vehicle);

        auditLogService.log(null, "MAINTENANCE_OPENED", "MaintenanceLogs", saved.getId().toString(), null, request.getDescription(), null);
        auditLogService.log(null, "VEHICLE_STATUS_CHANGED", "Vehicles", vehicle.getId().toString(), old.name(), "MAINTENANCE", null);

        emailService.sendMaintenanceAlert(vehicle.getRegistrationNumber(), request.getDescription(), request.getCost() != null ? request.getCost().toString() : "0.00");

        return saved;
    }

    // Closing maintenance restores the vehicle to Available, UNLESS it was retired meanwhile.
    @Transactional
    public MaintenanceLog close(Long maintenanceId) {
        MaintenanceLog log = maintenanceLogRepository.findById(maintenanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance log not found: " + maintenanceId));

        if (!Boolean.TRUE.equals(log.getIsActive())) {
            throw new BusinessRuleException("Maintenance log is already closed");
        }

        log.setIsActive(false);
        maintenanceLogRepository.save(log);

        Vehicle vehicle = vehicleRepository.findByIdForUpdate(log.getVehicle().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        if (vehicle.getStatus() != VehicleStatus.RETIRED) {
            VehicleStatus old = vehicle.getStatus();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
            auditLogService.log(null, "VEHICLE_STATUS_CHANGED", "Vehicles", vehicle.getId().toString(), old.name(), "AVAILABLE", null);
        }

        auditLogService.log(null, "MAINTENANCE_CLOSED", "MaintenanceLogs", maintenanceId.toString(), "ACTIVE", "CLOSED", null);
        return log;
    }

    public List<MaintenanceLog> findByVehicle(Long vehicleId) {
        return maintenanceLogRepository.findByVehicleId(vehicleId);
    }
}
