// =============================================================
// src/main/java/com/walton/sales/model/user/User.java
// MODIFIED: Added tokenVersion field.
// =============================================================
package com.walton.sales.model.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", uniqueConstraints = { 
    @UniqueConstraint(columnNames = "username"),
    @UniqueConstraint(columnNames = "email") 
})
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    private String username;

    @NotBlank
    @Size(max = 120)
    private String password;
    
    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 100)
    @Email
    private String email;

    @Size(max = 100)
    private String department;

    @Size(max = 20)
    private String phone;

    @Column(name = "is_active")
    private boolean isActive = false;

    // A counter that invalidates old tokens when a user logs in.
    private int tokenVersion = 0;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
               joinColumns = @JoinColumn(name = "user_id"),
               inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();
    
    private String securityQuestion;
    private String securityAnswer;

    public User(String username, String password, String name, String email, String department, String phone, String securityQuestion, String securityAnswer) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.department = department;
        this.phone = phone;
        this.securityQuestion = securityQuestion;
        this.securityAnswer = securityAnswer;
    }
}