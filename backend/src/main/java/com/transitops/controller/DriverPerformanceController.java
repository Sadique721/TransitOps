package com.transitops.controller;

import com.transitops.dto.response.DriverPerformanceResponse;
import com.transitops.service.DriverPerformanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/drivers")
@RequiredArgsConstructor
public class DriverPerformanceController {

    private final DriverPerformanceService driverPerformanceService;

    @GetMapping("/{id}/performance")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER')")
    public ResponseEntity<DriverPerformanceResponse> performance(@PathVariable Long id) {
        return ResponseEntity.ok(driverPerformanceService.computeScore(id));
    }

    // Ranking / leaderboard (Module 2 — Driver Ranking)
    @GetMapping("/leaderboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'SAFETY_OFFICER')")
    public ResponseEntity<List<DriverPerformanceResponse>> leaderboard() {
        return ResponseEntity.ok(driverPerformanceService.leaderboard());
    }
}

