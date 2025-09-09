// =============================================================
// src/main/java/com/walton/sales/payload/response/UserResponse.java
// MODIFIED: Added new fields to the user response.
// =============================================================
package com.walton.sales.payload.response;

import com.walton.sales.model.user.User;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class UserResponse {
    private Long id;
    private String username;
    private String name;
    private String email;
    private String department;
    private String phone;
    private boolean isActive;
    private Set<String> roles;

    public UserResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.name = user.getName();
        this.email = user.getEmail();
        this.department = user.getDepartment();
        this.phone = user.getPhone();
        this.isActive = user.isActive();
        this.roles = user.getRoles().stream()
                .map(role -> role.getName().toString())
                .collect(Collectors.toSet());
    }
}