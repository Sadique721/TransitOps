package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "trip_proofs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TripProof extends BaseEntity {
    private Long tripId;
    private String photoUrl;
    private String signatureUrl;
    private String verificationOtp;
}
