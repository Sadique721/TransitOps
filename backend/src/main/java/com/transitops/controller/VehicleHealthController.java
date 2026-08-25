package com.transitops.controller;

import com.transitops.dto.response.VehicleHealthResponse;
import com.transitops.service.VehicleHealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
public class VehicleHealthController {

    private final VehicleHealthService vehicleHealthService;

    @GetMapping("/{id}/health-score")
    public ResponseEntity<VehicleHealthResponse> healthScore(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleHealthService.computeHealthScore(id));
    }
}
