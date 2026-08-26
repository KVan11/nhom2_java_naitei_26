package com.sunbooking.domain.user.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPT = 3;
    private static final int LOCK_TIME_DURATION = 4; // minutes

    private final ConcurrentHashMap<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, LocalDateTime> lockCache = new ConcurrentHashMap<>();

    public void loginSucceeded(String key) {
        attemptsCache.remove(key);
        lockCache.remove(key);
    }

    public void loginFailed(String key) {
        int attempts = attemptsCache.getOrDefault(key, 0);
        attempts++;
        attemptsCache.put(key, attempts);
        if (attempts >= MAX_ATTEMPT) {
            lockCache.put(key, LocalDateTime.now().plusMinutes(LOCK_TIME_DURATION));
        }
    }

    public boolean isBlocked(String key) {
        if (!lockCache.containsKey(key)) {
            return false;
        }

        LocalDateTime lockTime = lockCache.get(key);
        if (lockTime.isBefore(LocalDateTime.now())) {
            lockCache.remove(key);
            attemptsCache.remove(key);
            return false;
        }

        return true;
    }
}
