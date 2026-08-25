package com.transitops.security;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.List;
import java.util.ArrayList;

@Service
public class LoginRateLimiterService {
    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCKTIME_MILLIS = TimeUnit.MINUTES.toMillis(15);

    private final ConcurrentHashMap<String, List<Long>> ipFailures = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, List<Long>> emailFailures = new ConcurrentHashMap<>();

    public boolean isBlocked(String ip, String email) {
        cleanOldFailures(ip, ipFailures);
        cleanOldFailures(email, emailFailures);

        List<Long> ipAttempts = ipFailures.get(ip);
        if (ipAttempts != null && ipAttempts.size() >= MAX_ATTEMPTS) {
            return true;
        }

        List<Long> emailAttempts = emailFailures.get(email);
        return emailAttempts != null && emailAttempts.size() >= MAX_ATTEMPTS;
    }

    public void recordFailure(String ip, String email) {
        recordFail(ip, ipFailures);
        recordFail(email, emailFailures);
    }

    public void recordSuccess(String ip, String email) {
        ipFailures.remove(ip);
        emailFailures.remove(email);
    }

    private void recordFail(String key, ConcurrentHashMap<String, List<Long>> map) {
        map.compute(key, (k, v) -> {
            List<Long> list = v == null ? new ArrayList<>() : new ArrayList<>(v);
            list.add(System.currentTimeMillis());
            return list;
        });
    }

    private void cleanOldFailures(String key, ConcurrentHashMap<String, List<Long>> map) {
        long now = System.currentTimeMillis();
        map.computeIfPresent(key, (k, list) -> {
            list.removeIf(timestamp -> now - timestamp > LOCKTIME_MILLIS);
            return list.isEmpty() ? null : list;
        });
    }
}
