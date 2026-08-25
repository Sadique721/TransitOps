package com.transitops.service;

import com.transitops.dto.request.ExpenseRequest;
import com.transitops.entity.Expense;
import com.transitops.entity.Trip;
import com.transitops.entity.Vehicle;
import com.transitops.repository.ExpenseRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.VehicleRepository;
import com.transitops.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public Expense create(ExpenseRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + request.getVehicleId()));

        Trip trip = null;
        if (request.getTripId() != null) {
            trip = tripRepository.findById(request.getTripId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip not found: " + request.getTripId()));
        }

        Expense expense = Expense.builder()
                .vehicle(vehicle)
                .trip(trip)
                .type(request.getType())
                .liters(request.getLiters())
                .cost(request.getCost())
                .date(request.getDate() != null ? request.getDate() : LocalDate.now())
                .build();

        Expense saved = expenseRepository.save(expense);
        auditLogService.log(null, "EXPENSE_LOGGED", "Expenses", saved.getId().toString(),
                null, request.getType() + ":" + request.getCost(), null);
        return saved;
    }

    public List<Expense> findByVehicle(Long vehicleId) {
        return expenseRepository.findByVehicleId(vehicleId);
    }

    public List<Expense> findAll() {
        return expenseRepository.findAll();
    }
}
