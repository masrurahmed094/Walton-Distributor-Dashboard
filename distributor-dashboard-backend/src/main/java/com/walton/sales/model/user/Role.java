// =============================================================
// src/main/java/com/walton/sales/model/user/Role.java
// =============================================================
package com.walton.sales.model.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    // MODIFIED: Added the unique = true constraint
    @Column(length = 20, unique = true)
    private ERole name;

    public Role(ERole name) {
        this.name = name;
    }
}
