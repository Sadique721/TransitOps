package com.transitops.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TripCompletedEvent {
    private final Long tripId;
    private final String tenantId;
}
