package com.transitops.service;

import com.transitops.entity.AuditLog;
import com.transitops.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

// PDF Rule #6: every Create/Update/Delete/Status-Change event must be logged.
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(Long userId, String action, String entityName, String entityId,
                     String oldValue, String newValue, String ipAddress) {
        AuditLog entry = AuditLog.builder()
                .userId(userId)
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .oldValue(oldValue)
                .newValue(newValue)
                .ipAddress(ipAddress)
                .build();
        auditLogRepository.save(entry);
    }
}
