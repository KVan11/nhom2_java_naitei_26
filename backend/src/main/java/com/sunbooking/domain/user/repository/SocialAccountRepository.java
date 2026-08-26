package com.sunbooking.domain.user.repository;

import com.sunbooking.domain.user.entity.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {
    Optional<SocialAccount> findByProviderAndProviderUid(String provider, String providerUid);
    java.util.List<SocialAccount> findByUserId(Long userId);
}
