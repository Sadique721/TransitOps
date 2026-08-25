package com.transitops.service.statemachine;

import com.transitops.enums.DriverStatus;
import com.transitops.exception.BusinessRuleException;
import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
public class DriverStateMachine {

    private static final Map<DriverStatus, Set<DriverStatus>> ALLOWED_TRANSITIONS = new HashMap<>();

    static {
        ALLOWED_TRANSITIONS.put(DriverStatus.AVAILABLE, EnumSet.of(DriverStatus.RESERVED, DriverStatus.OFF_DUTY, DriverStatus.SUSPENDED));
        ALLOWED_TRANSITIONS.put(DriverStatus.RESERVED, EnumSet.of(DriverStatus.ON_TRIP, DriverStatus.AVAILABLE, DriverStatus.OFF_DUTY, DriverStatus.SUSPENDED));
        ALLOWED_TRANSITIONS.put(DriverStatus.ON_TRIP, EnumSet.of(DriverStatus.BREAK, DriverStatus.OFF_DUTY, DriverStatus.SUSPENDED));
        ALLOWED_TRANSITIONS.put(DriverStatus.BREAK, EnumSet.of(DriverStatus.ON_TRIP, DriverStatus.AVAILABLE, DriverStatus.OFF_DUTY, DriverStatus.SUSPENDED));
        ALLOWED_TRANSITIONS.put(DriverStatus.OFF_DUTY, EnumSet.of(DriverStatus.AVAILABLE, DriverStatus.SUSPENDED));
        ALLOWED_TRANSITIONS.put(DriverStatus.SUSPENDED, EnumSet.of(DriverStatus.AVAILABLE, DriverStatus.OFF_DUTY));
    }

    public void transition(DriverStatus currentStatus, DriverStatus targetStatus, int safetyScore) {
        if (safetyScore < 50 && targetStatus != DriverStatus.SUSPENDED && currentStatus != DriverStatus.SUSPENDED) {
            throw new BusinessRuleException("Driver safety score is below 50. Driver must be SUSPENDED.");
        }
        if (currentStatus == targetStatus) {
            return;
        }
        Set<DriverStatus> allowed = ALLOWED_TRANSITIONS.get(currentStatus);
        if (allowed == null || !allowed.contains(targetStatus)) {
            throw new BusinessRuleException("Invalid Driver state transition from " + currentStatus + " to " + targetStatus);
        }
    }
}
