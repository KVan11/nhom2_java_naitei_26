package com.sunbooking.domain.user.entity;

import jakarta.persistence.*;
import java.time.Instant;
import com.sunbooking.global.common.BaseEntity;

@Entity
@Table(name = "refresh_token")
@AttributeOverride(name = "id", column = @Column(name = "token_id"))
public class RefreshToken extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    @Column(name = "token", nullable = false, unique = true)
    private String token;

    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Instant getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Instant expiryDate) {
        this.expiryDate = expiryDate;
    }
}
