package com.transitops.controller;

import com.transitops.dto.request.TripCompleteRequest;
import com.transitops.dto.request.TripCreateRequest;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.enums.TripStatus;
import com.transitops.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DRIVER', 'FINANCIAL_ANALYST', 'SAFETY_OFFICER')")
    public ResponseEntity<List<Trip>> findAll(@RequestParam(required = false) TripStatus status) {
        return ResponseEntity.ok(tripService.findAll(status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DRIVER', 'FINANCIAL_ANALYST', 'SAFETY_OFFICER')")
    public ResponseEntity<Trip> findById(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<Trip> createDraft(@Valid @RequestBody TripCreateRequest request) {
        return ResponseEntity.ok(tripService.createDraft(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<Trip> updateDraft(@PathVariable Long id, @Valid @RequestBody TripCreateRequest request) {
        return ResponseEntity.ok(tripService.updateDraft(id, request));
    }

    @PatchMapping("/{id}/dispatch")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<Trip> dispatch(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.dispatch(id));
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DRIVER')")
    public ResponseEntity<Trip> complete(@PathVariable Long id, @Valid @RequestBody TripCompleteRequest request) {
        return ResponseEntity.ok(tripService.complete(id, request));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<Trip> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.cancel(id));
    }

    // "AI Suggest" button (Section 7.3)
    @GetMapping("/suggest-vehicle")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<Vehicle> suggestVehicle(@RequestParam double cargoWeight) {
        return ResponseEntity.ok(tripService.suggestVehicle(cargoWeight));
    }
}

