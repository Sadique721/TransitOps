package com.transitops.service.statemachine;

import com.transitops.enums.VehicleStatus;
import com.transitops.exception.BusinessRuleException;
import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
public class VehicleStateMachine {

    private static final Map<VehicleStatus, Set<VehicleStatus>> ALLOWED_TRANSITIONS = new HashMap<>();

    static {
        ALLOWED_TRANSITIONS.put(VehicleStatus.REGISTERED, EnumSet.of(VehicleStatus.AVAILABLE, VehicleStatus.RETIRED));
        ALLOWED_TRANSITIONS.put(VehicleStatus.AVAILABLE, EnumSet.of(VehicleStatus.RESERVED, VehicleStatus.MAINTENANCE, VehicleStatus.RETIRED));
        ALLOWED_TRANSITIONS.put(VehicleStatus.RESERVED, EnumSet.of(VehicleStatus.ON_TRIP, VehicleStatus.AVAILABLE, VehicleStatus.RETIRED));
        ALLOWED_TRANSITIONS.put(VehicleStatus.ON_TRIP, EnumSet.of(VehicleStatus.RETURNED, VehicleStatus.RETIRED));
        ALLOWED_TRANSITIONS.put(VehicleStatus.RETURNED, EnumSet.of(VehicleStatus.INSPECTION, VehicleStatus.RETIRED));
        ALLOWED_TRANSITIONS.put(VehicleStatus.INSPECTION, EnumSet.of(VehicleStatus.MAINTENANCE, VehicleStatus.AVAILABLE, VehicleStatus.RETIRED));
        ALLOWED_TRANSITIONS.put(VehicleStatus.MAINTENANCE, EnumSet.of(VehicleStatus.AVAILABLE, VehicleStatus.RETIRED));
        ALLOWED_TRANSITIONS.put(VehicleStatus.RETIRED, EnumSet.noneOf(VehicleStatus.class));
    }

    public void transition(VehicleStatus currentStatus, VehicleStatus targetStatus) {
        if (currentStatus == targetStatus) {
            return;
        }
        Set<VehicleStatus> allowed = ALLOWED_TRANSITIONS.get(currentStatus);
        if (allowed == null || !allowed.contains(targetStatus)) {
            throw new BusinessRuleException("Invalid Vehicle state transition from " + currentStatus + " to " + targetStatus);
        }
    }
}
