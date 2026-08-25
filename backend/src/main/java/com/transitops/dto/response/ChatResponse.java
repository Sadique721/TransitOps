package com.transitops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String answer;
    private String matchedIntent; // which rule matched, "UNRECOGNIZED" if none — useful for debugging/demo
}
