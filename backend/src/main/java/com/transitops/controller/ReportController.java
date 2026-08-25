package com.transitops.controller;

import com.transitops.dto.response.DashboardResponse;
import com.transitops.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> dashboard() {
        return ResponseEntity.ok(reportService.dashboard());
    }

    @GetMapping("/fuel-efficiency")
    public ResponseEntity<Map<String, Double>> fuelEfficiency() {
        return ResponseEntity.ok(reportService.fuelEfficiencyPerVehicle());
    }

    @GetMapping("/operational-cost")
    public ResponseEntity<Map<String, BigDecimal>> operationalCost() {
        return ResponseEntity.ok(reportService.operationalCostPerVehicle());
    }

    @GetMapping("/export/csv")
    public ResponseEntity<String> exportCsv() {
        DashboardResponse d = reportService.dashboard();
        StringBuilder csv = new StringBuilder();
        csv.append("Metric,Value\n");
        csv.append("Total Vehicles,").append(d.getTotalVehicles()).append("\n");
        csv.append("Available Vehicles,").append(d.getAvailableVehicles()).append("\n");
        csv.append("On Trip Vehicles,").append(d.getOnTripVehicles()).append("\n");
        csv.append("In Shop Vehicles,").append(d.getInShopVehicles()).append("\n");
        csv.append("Active Trips,").append(d.getActiveTrips()).append("\n");
        csv.append("Fleet Utilization %,").append(d.getFleetUtilizationPercent()).append("\n");

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transitops_report.csv");
        return ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType("text/csv")).body(csv.toString());
    }
}
