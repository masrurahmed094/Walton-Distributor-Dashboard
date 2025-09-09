package com.walton.sales.controller;

import com.walton.sales.payload.response.MessageResponse;
import com.walton.sales.payload.response.UserResponse;
import com.walton.sales.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
// @CrossOrigin has been removed to centralize CORS configuration in SecurityConfig.java
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/access")
    public ResponseEntity<MessageResponse> updateUserAccess(
            @PathVariable Long id,
            @RequestParam boolean isActive) {
        adminService.updateUserAccess(id, isActive);
        String message = isActive ? "User account has been activated successfully." : "User account has been deactivated successfully.";
        return ResponseEntity.ok(new MessageResponse(message));
    }
}

