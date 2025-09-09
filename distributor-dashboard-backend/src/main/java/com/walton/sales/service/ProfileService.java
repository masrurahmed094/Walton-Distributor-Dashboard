// =============================================================
// src/main/java/com/walton/sales/service/ProfileService.java
// MODIFIED: Removed logic to update username and password.
// =============================================================
package com.walton.sales.service;

import com.walton.sales.model.user.User;
import com.walton.sales.payload.request.UpdateProfileRequest;
import com.walton.sales.payload.response.MessageResponse;
import com.walton.sales.payload.response.UserResponse;
import com.walton.sales.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponse getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Error: User not found."));
        return new UserResponse(user);
    }

    public MessageResponse updateUserProfile(String currentUsername, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(currentUsername)
            .orElseThrow(() -> new RuntimeException("Error: User not found."));
        
        // Check if the new email is already taken by another user
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Only update the mutable fields
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setDepartment(request.getDepartment());
        user.setPhone(request.getPhone());

        userRepository.save(user);
        return new MessageResponse("Profile updated successfully.");
    }

    public MessageResponse deleteUserProfile(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Error: User not found."));
        
        userRepository.delete(user);
        return new MessageResponse("User account deleted successfully.");
    }
}