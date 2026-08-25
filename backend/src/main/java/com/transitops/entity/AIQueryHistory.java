package com.transitops.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "ai_query_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AIQueryHistory extends BaseEntity {
    private String predictionType;
    private String predictedValue;
    private Double confidenceScore;
}
