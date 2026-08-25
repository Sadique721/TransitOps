package com.transitops.service;

import com.transitops.entity.Driver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

// Bonus feature (Section 8.1): runs every 24h, flags drivers whose license
// expires within 7 days. Wire an actual mail sender (JavaMailSender) in
// production; logging is kept here so the job is runnable without SMTP config.
@Service
@RequiredArgsConstructor
@Slf4j
public class LicenseExpiryReminderJob {

    private final DriverService driverService;
    private final EmailService emailService;

    @org.springframework.beans.factory.annotation.Value("${ADMIN_EMAIL:entitykart@gmail.com}")
    private String adminEmail;

    @Scheduled(cron = "0 0 8 * * *") // every day at 08:00
    public void checkExpiringLicenses() {
        List<Driver> expiring = driverService.findExpiringWithinDays(7);
        for (Driver driver : expiring) {
            log.warn("License expiry reminder: {} (license {}) expires on {}",
                    driver.getName(), driver.getLicenseNumber(), driver.getLicenseExpiryDate());
            
            String subject = "🪪 LICENSE EXPIRY WARNING: " + driver.getName();
            String htmlContent = "<h3>TransitOps Driver Compliance</h3>"
                    + "<p>Driver <strong>" + driver.getName() + "</strong>'s license is expiring soon!</p>"
                    + "<ul>"
                    + "<li><strong>License Number:</strong> " + driver.getLicenseNumber() + "</li>"
                    + "<li><strong>Category:</strong> " + driver.getLicenseCategory() + "</li>"
                    + "<li><strong>Expiry Date:</strong> <span style='color: orange; font-weight: bold;'>" + driver.getLicenseExpiryDate() + "</span></li>"
                    + "</ul>"
                    + "<p>Please ensure they renew their credentials or suspend them from dispatch to prevent regulatory compliance issues.</p>";
            emailService.sendHtmlEmail(adminEmail, subject, htmlContent);
        }
    }
}
