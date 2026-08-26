package com.sunbooking.global.security;

import com.sunbooking.domain.user.entity.User;
import com.sunbooking.domain.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String lowercaseUsername = username.toLowerCase();
        User user = userRepository.findByUsername(lowercaseUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + lowercaseUsername));
        return new CustomUserDetails(user);
    }
}
