package com.transitops.service.statemachine;

import com.transitops.enums.TripStatus;
import com.transitops.exception.BusinessRuleException;
import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
public class TripStateMachine {

    private static final Map<TripStatus, Set<TripStatus>> ALLOWED_TRANSITIONS = new HashMap<>();

    static {
        ALLOWED_TRANSITIONS.put(TripStatus.DRAFT, EnumSet.of(TripStatus.PENDING_APPROVAL, TripStatus.CANCELLED));
        ALLOWED_TRANSITIONS.put(TripStatus.PENDING_APPROVAL, EnumSet.of(TripStatus.APPROVED, TripStatus.CANCELLED));
        ALLOWED_TRANSITIONS.put(TripStatus.APPROVED, EnumSet.of(TripStatus.ASSIGNED, TripStatus.CANCELLED));
        ALLOWED_TRANSITIONS.put(TripStatus.ASSIGNED, EnumSet.of(TripStatus.DISPATCHED, TripStatus.CANCELLED));
        ALLOWED_TRANSITIONS.put(TripStatus.DISPATCHED, EnumSet.of(TripStatus.IN_PROGRESS, TripStatus.CANCELLED));
        ALLOWED_TRANSITIONS.put(TripStatus.IN_PROGRESS, EnumSet.of(TripStatus.AT_STOP, TripStatus.DELIVERED, TripStatus.CANCELLED));
        ALLOWED_TRANSITIONS.put(TripStatus.AT_STOP, EnumSet.of(TripStatus.IN_PROGRESS, TripStatus.DELIVERED, TripStatus.CANCELLED));
        ALLOWED_TRANSITIONS.put(TripStatus.DELIVERED, EnumSet.of(TripStatus.COMPLETED, TripStatus.CANCELLED));
        ALLOWED_TRANSITIONS.put(TripStatus.COMPLETED, EnumSet.noneOf(TripStatus.class));
        ALLOWED_TRANSITIONS.put(TripStatus.CANCELLED, EnumSet.noneOf(TripStatus.class));
    }

    public void transition(TripStatus currentStatus, TripStatus targetStatus) {
        if (currentStatus == targetStatus) {
            return;
        }
        Set<TripStatus> allowed = ALLOWED_TRANSITIONS.get(currentStatus);
        if (allowed == null || !allowed.contains(targetStatus)) {
            throw new BusinessRuleException("Invalid Trip state transition from " + currentStatus + " to " + targetStatus);
        }
    }
}
