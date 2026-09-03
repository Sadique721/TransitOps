package com.transitops.controller;

import com.transitops.dto.request.VehicleRequest;
import com.transitops.dto.request.VehicleStatusRequest;
import com.transitops.entity.Vehicle;
import com.transitops.enums.VehicleStatus;
import com.transitops.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST', 'DRIVER')")
    public ResponseEntity<List<Vehicle>> findAll(@RequestParam(required = false) VehicleStatus status) {
        return ResponseEntity.ok(vehicleService.findAll(status));
    }

    @GetMapping("/dispatchable")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER')")
    public ResponseEntity<List<Vehicle>> findDispatchable() {
        return ResponseEntity.ok(vehicleService.findDispatchable());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST', 'DRIVER')")
    public ResponseEntity<Vehicle> findById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<Vehicle> create(@Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<Vehicle> update(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<Vehicle> changeStatus(@PathVariable Long id, @Valid @RequestBody VehicleStatusRequest request) {
        return ResponseEntity.ok(vehicleService.changeStatus(id, request.getStatus()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<Void> retire(@PathVariable Long id) {
        vehicleService.retire(id);
        return ResponseEntity.noContent().build();
    }
}

