// =============================================================
// src/main/java/com/walton/sales/controller/ProfileController.java
// NEW FILE
// =============================================================
package com.walton.sales.controller;

import com.walton.sales.payload.request.UpdateProfileRequest;
import com.walton.sales.payload.response.MessageResponse;
import com.walton.sales.payload.response.UserResponse;
import com.walton.sales.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profile")
// @CrossOrigin has been removed to centralize CORS configuration in SecurityConfig.java
@PreAuthorize("isAuthenticated()")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public ResponseEntity<UserResponse> getMyProfile(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(profileService.getUserProfile(userDetails.getUsername()));
    }

    @PutMapping
    public ResponseEntity<MessageResponse> updateMyProfile(Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(profileService.updateUserProfile(userDetails.getUsername(), request));
    }

    @DeleteMapping
    public ResponseEntity<MessageResponse> deleteMyProfile(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(profileService.deleteUserProfile(userDetails.getUsername()));
    }
}

