package com.transitops.exception;

// Thrown whenever a mandatory business rule (PDF Section 4) is violated.
// Always results in HTTP 400 Bad Request.
public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) {
        super(message);
    }
}
