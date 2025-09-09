// =============================================================
// src/main/java/com/walton/sales/repository/user/RoleRepository.java
// =============================================================
package com.walton.sales.repository.user;

import com.walton.sales.model.user.ERole;
import com.walton.sales.model.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);
}