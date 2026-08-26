package com.sunbooking.global.security;

import com.sunbooking.global.security.oauth2.CustomOAuth2UserService;
import com.sunbooking.global.security.oauth2.OAuth2AuthenticationFailureHandler;
import com.sunbooking.global.security.oauth2.OAuth2AuthenticationSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        private final JwtUtils jwtUtils;
        private final CustomOAuth2UserService customOAuth2UserService;
        private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
        private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
        private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;
        private final ClientRegistrationRepository clientRegistrationRepository;

        public SecurityConfig(JwtUtils jwtUtils,
                              CustomOAuth2UserService customOAuth2UserService,
                              OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler,
                              OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler,
                              HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository,
                              ClientRegistrationRepository clientRegistrationRepository) {
                this.jwtUtils = jwtUtils;
                this.customOAuth2UserService = customOAuth2UserService;
                this.oAuth2AuthenticationSuccessHandler = oAuth2AuthenticationSuccessHandler;
                this.oAuth2AuthenticationFailureHandler = oAuth2AuthenticationFailureHandler;
                this.httpCookieOAuth2AuthorizationRequestRepository = httpCookieOAuth2AuthorizationRequestRepository;
                this.clientRegistrationRepository = clientRegistrationRepository;
        }

        @Bean
        public JwtAuthenticationFilter jwtAuthenticationFilter(UserDetailsService userDetailsService) {
                return new JwtAuthenticationFilter(jwtUtils, userDetailsService);
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
                throws Exception {
                return authenticationConfiguration.getAuthenticationManager();
        }

        @Bean
        public HttpFirewall strictHttpFirewall() {
                StrictHttpFirewall firewall = new StrictHttpFirewall();
                firewall.setAllowUrlEncodedDoubleSlash(false);
                firewall.setAllowSemicolon(false);
                return firewall;
        }

        private OAuth2AuthorizationRequestResolver authorizationRequestResolver() {
                DefaultOAuth2AuthorizationRequestResolver resolver = new DefaultOAuth2AuthorizationRequestResolver(
                        clientRegistrationRepository, "/oauth2/authorization");
                resolver.setAuthorizationRequestCustomizer(customizer -> customizer
                        .additionalParameters(params -> params.put("prompt", "select_account")));
                return resolver;
        }

        @Value("${app.cors.allowed-origins:http://localhost:5173}")
        private List<String> allowedOrigins;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                       JwtAuthenticationFilter jwtAuthenticationFilter)
                throws Exception {
                org.springframework.security.web.csrf.CookieCsrfTokenRepository tokenRepository = org.springframework.security.web.csrf.CookieCsrfTokenRepository
                        .withHttpOnlyFalse();
                org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler delegate = new org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler();
                delegate.setCsrfRequestAttributeName("_csrf");

                http
                        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                        .csrf(csrf -> csrf
                                .ignoringRequestMatchers("/api/payments/**")
                                .csrfTokenRepository(tokenRepository)
                                .csrfTokenRequestHandler(delegate))
                        .addFilterAfter(new CsrfCookieFilter(),
                                org.springframework.security.web.authentication.www.BasicAuthenticationFilter.class)
                        .sessionManagement(session -> session
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                        .authorizeHttpRequests(authorize -> authorize
                                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                                .requestMatchers("/api/auth/login", "/api/auth/register", "/oauth2/**", "/login/oauth2/code/**").permitAll()

                                .requestMatchers("/api/payments", "/api/payments/**").permitAll()

                                .requestMatchers(HttpMethod.GET, "/api/reviews/**", "/api/tours/**", "/api/categories/**").permitAll()
                                .anyRequest().authenticated())
                        .oauth2Login(oauth2 -> oauth2
                                .authorizationEndpoint(authorization -> authorization
                                        .baseUri("/oauth2/authorization")
                                        .authorizationRequestResolver(authorizationRequestResolver())
                                        .authorizationRequestRepository(httpCookieOAuth2AuthorizationRequestRepository))
                                .redirectionEndpoint(redirection -> redirection
                                        .baseUri("/login/oauth2/code/*"))
                                .userInfoEndpoint(userInfo -> userInfo
                                        .userService(customOAuth2UserService))
                                .successHandler(oAuth2AuthenticationSuccessHandler)
                                .failureHandler(oAuth2AuthenticationFailureHandler));

                http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(allowedOrigins);
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control", "X-XSRF-TOKEN"));
                configuration.setExposedHeaders(List.of("Authorization", "X-XSRF-TOKEN"));
                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}