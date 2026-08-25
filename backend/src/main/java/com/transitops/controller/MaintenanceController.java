package com.transitops.controller;

import com.transitops.dto.request.MaintenanceRequest;
import com.transitops.entity.MaintenanceLog;
import com.transitops.service.MaintenanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping
    public ResponseEntity<MaintenanceLog> create(@Valid @RequestBody MaintenanceRequest request) {
        return ResponseEntity.ok(maintenanceService.create(request));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<MaintenanceLog> close(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.close(id));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<MaintenanceLog>> findByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(maintenanceService.findByVehicle(vehicleId));
    }
}
