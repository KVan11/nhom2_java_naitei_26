package com.sunbooking.security.oauth2;

import com.sunbooking.entity.User;
import com.sunbooking.security.CustomUserDetails;
import com.sunbooking.service.SocialAuthService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final SocialAuthService socialAuthService;

    public CustomOAuth2UserService(SocialAuthService socialAuthService) {
        this.socialAuthService = socialAuthService;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);
        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();

        try {
            User user = socialAuthService.processOAuth2User(registrationId, oAuth2User.getAttributes());
            return new CustomUserDetails(user, oAuth2User.getAttributes());
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }
}
