package com.transitops.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:entitykart@gmail.com}")
    private String fromEmail;

    @Value("${ADMIN_EMAIL:entitykart@gmail.com}")
    private String adminEmail;

    @Async
    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}", to, e);
        }
    }

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("HTML Email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send HTML email to {}", to, e);
        }
    }

    public void sendFuelAlert(String tripNumber, String vehicleReg, double deviationPercent) {
        String subject = "🚨 SUSPECTED FUEL THEFT ALERT — Trip #" + tripNumber;
        String content = "<h3>TransitOps Alert Center</h3>"
                + "<p><strong>Suspicious fuel consumption detected:</strong></p>"
                + "<ul>"
                + "<li><strong>Trip Number:</strong> " + tripNumber + "</li>"
                + "<li><strong>Vehicle:</strong> " + vehicleReg + "</li>"
                + "<li><strong>Deviation:</strong> <span style='color: red; font-weight: bold;'>" + deviationPercent + "%</span> above expected threshold</li>"
                + "</ul>"
                + "<p>Please inspect the vehicle odometer and fuel logs immediately.</p>";
        sendHtmlEmail(adminEmail, subject, content);
    }

    public void sendMaintenanceAlert(String vehicleReg, String description, String cost) {
        String subject = "🔧 MAINTENANCE WORK ORDER CREATED — " + vehicleReg;
        String content = "<h3>TransitOps Fleet Maintenance</h3>"
                + "<p>A new maintenance log has been created for vehicle <strong>" + vehicleReg + "</strong>.</p>"
                + "<ul>"
                + "<li><strong>Description:</strong> " + description + "</li>"
                + "<li><strong>Cost:</strong> $" + cost + "</li>"
                + "</ul>"
                + "<p>The vehicle status has been set to <strong>IN_SHOP</strong> and is temporarily blocked from dispatch.</p>";
        sendHtmlEmail(adminEmail, subject, content);
    }
}
