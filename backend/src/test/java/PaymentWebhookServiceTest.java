package com.sunbooking.domain.payment.service;

import com.sunbooking.config.SePayConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class PaymentWebhookServiceTest {

    @Mock private SePayConfig sePayConfig;
    @InjectMocks private PaymentWebhookService webhookService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(sePayConfig.getWebhookSecret()).thenReturn("test_secret");
    }

    @Test
    void verifySignature_ShouldReturnFalse_WhenSignatureIsInvalid() {
        String rawBody = "{\"id\":123}";
        // Random fake signature
        boolean result = webhookService.verifySignature("wrong_sign", rawBody);
        assertFalse(result);
    }
}