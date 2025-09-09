package com.walton.sales.controller;

import com.walton.sales.model.user.ERole;
import com.walton.sales.model.user.Role;
import com.walton.sales.model.user.User;
import com.walton.sales.payload.request.LoginRequest;
import com.walton.sales.payload.request.RegisterRequest;
import com.walton.sales.payload.request.ResetPasswordRequest;
import com.walton.sales.payload.response.JwtResponse;
import com.walton.sales.payload.response.MessageResponse;
import com.walton.sales.payload.response.SecurityQuestionResponse;
import com.walton.sales.repository.user.RoleRepository;
import com.walton.sales.repository.user.UserRepository;
import com.walton.sales.security.JwtTokenProvider;
import com.walton.sales.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
// @CrossOrigin has been removed to centralize CORS configuration in SecurityConfig.java
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found after authentication."));
        user.setTokenVersion(user.getTokenVersion() + 1);
        userRepository.save(user);

        UserDetailsImpl updatedUserDetails = UserDetailsImpl.build(user);
        Authentication updatedAuthentication = new UsernamePasswordAuthenticationToken(
                updatedUserDetails, authentication.getCredentials(), updatedUserDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(updatedAuthentication);
        String jwt = jwtTokenProvider.generateToken(updatedAuthentication);
        return ResponseEntity.ok(new JwtResponse(jwt));
    }

    @PostMapping("/logout")
    @Transactional
    public ResponseEntity<?> logoutUser(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String username = userDetails.getUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        user.setTokenVersion(user.getTokenVersion() + 1);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Logout successful. Current token has been invalidated."));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(
                registerRequest.getUsername(),
                encoder.encode(registerRequest.getPassword()),
                registerRequest.getName(),
                registerRequest.getEmail(),
                registerRequest.getDepartment(),
                registerRequest.getPhone(),
                registerRequest.getSecurityQuestion(),
                encoder.encode(registerRequest.getSecurityAnswer())
        );
        
        user.setTokenVersion(1);

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully! Account is pending admin approval."));
    }
    
    @PostMapping("/forgot-password/request")
    public ResponseEntity<?> requestSecurityQuestion(@RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        return ResponseEntity.ok(new SecurityQuestionResponse(user.getSecurityQuestion()));
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        if (encoder.matches(request.getSecurityAnswer(), user.getSecurityAnswer())) {
            user.setPassword(encoder.encode(request.getNewPassword()));
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("Password has been reset successfully."));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: The security answer is incorrect."));
        }
    }
}

