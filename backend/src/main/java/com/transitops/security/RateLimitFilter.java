package com.transitops.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * CRITICAL/HIGH FIX (audit item: "Insufficient Rate Limiting" — OWASP #10).
 *
 * A simple fixed-window rate limiter, keyed by client IP: each IP gets a
 * budget of {@code requests-per-minute} requests per rolling 60-second
 * window; once exhausted, further requests get HTTP 429 until the window
 * resets.
 *
 * This is intentionally dependency-free (no Redis) so it works out of the
 * box on a single instance. It does NOT work correctly across multiple
 * backend instances behind a load balancer, since each instance keeps its
 * own counters — if you scale horizontally, replace the in-memory map below
 * with a Redis `INCR` + `EXPIRE` based limiter (same interface, same filter
 * position in SecurityConfig).
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    @Value("${rate-limit.enabled:true}")
    private boolean enabled;

    @Value("${rate-limit.requests-per-minute:120}")
    private int requestsPerMinute;

    private static final long WINDOW_MILLIS = 60_000L;

    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {

        if (!enabled) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientKey = clientKey(request);
        Window window = windows.computeIfAbsent(clientKey, k -> new Window());

        long now = System.currentTimeMillis();
        synchronized (window) {
            if (now - window.windowStart >= WINDOW_MILLIS) {
                window.windowStart = now;
                window.count.set(0);
            }
            int current = window.count.incrementAndGet();
            if (current > requestsPerMinute) {
                response.setStatus(429); // Too Many Requests
                response.setContentType("application/json");
                response.getWriter().write(
                        "{\"error\":\"Too many requests. Limit is " + requestsPerMinute + " requests/minute.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String clientKey(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static final class Window {
        private volatile long windowStart = System.currentTimeMillis();
        private final AtomicInteger count = new AtomicInteger(0);
    }
}
