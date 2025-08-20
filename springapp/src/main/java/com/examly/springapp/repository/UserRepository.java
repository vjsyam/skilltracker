package com.examly.springapp.repository;

import com.examly.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    
    // Alternative methods that handle duplicates better
    Optional<User> findFirstByEmailOrderByIdAsc(String email);
    List<User> findAllByEmail(String email);
    
    // boolean existsByEmail(String email);
}