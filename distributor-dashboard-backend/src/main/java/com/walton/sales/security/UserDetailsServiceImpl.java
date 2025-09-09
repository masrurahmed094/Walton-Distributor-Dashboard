// =============================================================
// src/main/java/com/walton/sales/security/UserDetailsServiceImpl.java
// =============================================================
package com.walton.sales.security;

import com.walton.sales.model.user.User;
import com.walton.sales.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
        if (!user.isActive()) {
            throw new UsernameNotFoundException("User account is not active.");
        }
        return UserDetailsImpl.build(user);
    }
}