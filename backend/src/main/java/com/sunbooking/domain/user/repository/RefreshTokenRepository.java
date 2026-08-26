package com.sunbooking.domain.user.repository;

import com.sunbooking.domain.user.entity.RefreshToken;
import com.sunbooking.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    Optional<RefreshToken> findByToken(String token);

    @Modifying
    int deleteByUser(User user);
    
    @Modifying
    int deleteByToken(String token);
}
