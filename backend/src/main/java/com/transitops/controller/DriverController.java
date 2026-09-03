package com.transitops.controller;

import com.transitops.dto.request.DriverRequest;
import com.transitops.entity.Driver;
import com.transitops.enums.DriverStatus;
import com.transitops.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER')")
    public ResponseEntity<List<Driver>> findAll(@RequestParam(required = false) DriverStatus status) {
        return ResponseEntity.ok(driverService.findAll(status));
    }

    @GetMapping("/dispatchable")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER')")
    public ResponseEntity<List<Driver>> findDispatchable() {
        return ResponseEntity.ok(driverService.findDispatchable());
    }

    @GetMapping("/expiring")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER')")
    public ResponseEntity<List<Driver>> findExpiring(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(driverService.findExpiringWithinDays(days));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER')")
    public ResponseEntity<Driver> findById(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<Driver> create(@Valid @RequestBody DriverRequest request) {
        return ResponseEntity.ok(driverService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<Driver> update(@PathVariable Long id, @Valid @RequestBody DriverRequest request) {
        return ResponseEntity.ok(driverService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<Driver> changeStatus(@PathVariable Long id, @RequestParam DriverStatus status) {
        return ResponseEntity.ok(driverService.changeStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        driverService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

