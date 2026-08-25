package com.transitops.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class TripCompletedEventHandler {

    @Async
    @EventListener
    public void handleTripCompleted(TripCompletedEvent event) {
        log.info("Processing TripCompletedEvent asynchronously for Trip ID: {} under Tenant: {}",
                event.getTripId(), event.getTenantId());

        // 1. Trigger auto-invoicing
        triggerAutoInvoicing(event.getTripId(), event.getTenantId());

        // 2. Audit fuel logs
        auditFuelLogs(event.getTripId(), event.getTenantId());

        // 3. Schedule next diagnostic checks
        scheduleDiagnosticCheck(event.getTripId(), event.getTenantId());
    }

    private void triggerAutoInvoicing(Long tripId, String tenantId) {
        log.info("Auto-invoicing triggered for Trip ID: {}", tripId);
    }

    private void auditFuelLogs(Long tripId, String tenantId) {
        log.info("Fuel-log audit triggered for Trip ID: {}", tripId);
    }

    private void scheduleDiagnosticCheck(Long tripId, String tenantId) {
        log.info("Diagnostic check scheduling triggered for Trip ID: {}", tripId);
    }
}
