// =============================================================
// src/main/java/com/walton/sales/service/AdminService.java
// =============================================================
package com.walton.sales.service;

import com.walton.sales.model.user.User;
import com.walton.sales.payload.response.MessageResponse;
import com.walton.sales.payload.response.UserResponse;
import com.walton.sales.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public MessageResponse updateUserAccess(Long id, boolean isActive) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        
        user.setActive(isActive);
        userRepository.save(user);

        String status = isActive ? "activated" : "deactivated";
        return new MessageResponse("User account has been " + status + " successfully.");
    }
}