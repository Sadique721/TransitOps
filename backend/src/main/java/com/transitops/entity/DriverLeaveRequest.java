package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "driver_leave_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DriverLeaveRequest extends BaseEntity {
    private Long driverId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String leaveType;
    private String status; // PENDING, APPROVED, REJECTED
}
