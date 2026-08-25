package com.transitops.controller;

import com.transitops.dto.request.ExpenseRequest;
import com.transitops.entity.Expense;
import com.transitops.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<Expense> create(@Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<Expense>> findAll() {
        return ResponseEntity.ok(expenseService.findAll());
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<Expense>> findByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(expenseService.findByVehicle(vehicleId));
    }
}
