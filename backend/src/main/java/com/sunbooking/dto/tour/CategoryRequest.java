package com.sunbooking.dto.tour;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank @Size(max = 255) String name,
        String description
) {
}