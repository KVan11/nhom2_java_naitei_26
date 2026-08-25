package com.sunbooking.domain.payment.service;

import com.sunbooking.config.SePayConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class PaymentWebhookService {

    private final SePayConfig sePayConfig;

    /**
     * Verify if the request comes from SePay using HMAC-SHA256
     * @param signatureHeader Header "x-sepay-signature" or similar from SePay
     * @param rawBody The raw JSON string from the request body
     */
    public boolean verifySignature(String signatureHeader, String rawBody) {
        if (signatureHeader == null || signatureHeader.isEmpty()) return false;

        try {
            // HMAC-SHA256 algorithm
            Mac sha256HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                    sePayConfig.getWebhookSecret().getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );
            sha256HMAC.init(secretKey);

            // Compute hash
            byte[] hashBytes = sha256HMAC.doFinal(rawBody.getBytes(StandardCharsets.UTF_8));
            String computedSignature = Base64.getEncoder().encodeToString(hashBytes);

            System.out.println("--- EXPECTED SIGNATURE FOR INSOMNIA ---");
            System.out.println(computedSignature);
            System.out.println("---------------------------------------");

            // Compare computed hash with header signature
            return computedSignature.equals(signatureHeader);
        } catch (Exception e) {
            return false;
        }
    }
}