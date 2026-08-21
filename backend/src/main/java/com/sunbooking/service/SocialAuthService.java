package com.sunbooking.service;

import com.sunbooking.entity.SocialAccount;
import com.sunbooking.entity.User;
import com.sunbooking.repository.SocialAccountRepository;
import com.sunbooking.repository.UserRepository;
import com.sunbooking.security.oauth2.OAuth2UserInfo;
import com.sunbooking.security.oauth2.OAuth2UserInfoFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class SocialAuthService {

    private final UserRepository userRepository;
    private final SocialAccountRepository socialAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public SocialAuthService(UserRepository userRepository, SocialAccountRepository socialAccountRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.socialAccountRepository = socialAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User processOAuth2User(String registrationId, Map<String, Object> attributes) {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, attributes);

        if (oAuth2UserInfo.getId() == null || oAuth2UserInfo.getId().isBlank()) {
            throw new IllegalArgumentException("Provider UID not found from OAuth2 provider");
        }

        Optional<SocialAccount> socialAccountOpt = socialAccountRepository
                .findByProviderAndProviderUid(registrationId, oAuth2UserInfo.getId());

        if (socialAccountOpt.isPresent()) {
            SocialAccount socialAccount = socialAccountOpt.get();
            User user = socialAccount.getUser();
            boolean updated = false;
            if (oAuth2UserInfo.getName() != null && !oAuth2UserInfo.getName().equals(user.getFullName())) {
                user.setFullName(oAuth2UserInfo.getName());
                updated = true;
            }
            if (oAuth2UserInfo.getImageUrl() != null && !oAuth2UserInfo.getImageUrl().equals(user.getAvatar())) {
                user.setAvatar(oAuth2UserInfo.getImageUrl());
                updated = true;
            }
            if (updated) {
                userRepository.save(user);
            }
            return user;
        } else {
            return registerNewSocialUser(registrationId, oAuth2UserInfo);
        }
    }

    private User registerNewSocialUser(String registrationId, OAuth2UserInfo oAuth2UserInfo) {
        String email = oAuth2UserInfo.getEmail();

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email not found from OAuth2 provider");
        }

        User user;
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            user = userOpt.get();
        } else {
            user = new User();
            String baseUsername = email.split("@")[0];
            String username = baseUsername;
            int suffix = 1;
            while (userRepository.existsByUsername(username)) {
                username = baseUsername + "_" + suffix++;
            }
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setFullName(oAuth2UserInfo.getName());
            user.setEmail(email);
            user.setAvatar(oAuth2UserInfo.getImageUrl());
            user.setRole("USER");
            user.setStatus("ACTIVE");
            user = userRepository.save(user);
        }

        SocialAccount socialAccount = new SocialAccount();
        socialAccount.setUser(user);
        socialAccount.setProvider(registrationId);
        socialAccount.setProviderUid(oAuth2UserInfo.getId());
        socialAccountRepository.save(socialAccount);

        return user;
    }
}
