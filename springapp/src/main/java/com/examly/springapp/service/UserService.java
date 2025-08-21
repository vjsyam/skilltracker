package com.examly.springapp.service;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        // Store password as plain text (no encoding needed)
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(updatedUser.getName());
                    user.setEmail(updatedUser.getEmail());
                    user.setRole(updatedUser.getRole());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User findByEmail(String email) {
        // Use the safer method that handles duplicates
        Optional<User> userOpt = userRepository.findFirstByEmailOrderByIdAsc(email);
        return userOpt.orElse(null);
    }

    public User authenticateUser(String email, String password) {
        User user = findByEmail(email);
        
        if (user != null && password.equals(user.getPassword())) {
            // Normalize role to match expected format
            if ("Manager".equals(user.getRole()) || "MANAGER".equals(user.getRole()) || "Admin".equals(user.getRole()) || "ADMIN".equals(user.getRole())) {
                user.setRole("ADMIN");
            } else if ("Engineer".equals(user.getRole()) || "Employee".equals(user.getRole()) || "EMPLOYEE".equals(user.getRole())) {
                user.setRole("EMPLOYEE");
            }

            return user;
        }
        return null;
    }
}

// package com.examly.springapp.service;

// import com.examly.springapp.model.User;
// import com.examly.springapp.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.stereotype.Service;

// import java.util.List;
// import java.util.Optional;

// @Service
// public class UserService {

//     @Autowired
//     private UserRepository userRepository;

//     private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

//     public List<User> getAllUsers() {
//         return userRepository.findAll();
//     }

//     public Optional<User> getUserById(Long id) {
//         return userRepository.findById(id);
//     }

//     public User createUser(User user) {
//         // Validate role
//         if (!user.getRole().equals(User.ROLE_MANAGER)) {
//             user.setRole(User.ROLE_EMPLOYEE); // Default to EMPLOYEE if not MANAGER
//         }
//         user.setPassword(passwordEncoder.encode(user.getPassword()));
//         return userRepository.save(user);
//     }

//     public User updateUser(Long id, User updatedUser) {
//         return userRepository.findById(id)
//                 .map(user -> {
//                     user.setName(updatedUser.getName());
//                     user.setEmail(updatedUser.getEmail());
//                     // Only allow role update if current user is MANAGER
//                     if (user.getRole().equals(User.ROLE_MANAGER)) {
//                         user.setRole(updatedUser.getRole());
//                     }
//                     return userRepository.save(user);
//                 })
//                 .orElseThrow(() -> new RuntimeException("User not found"));
//     }

//     public void deleteUser(Long id) {
//         userRepository.deleteById(id);
//     }

//     public User findByEmail(String email) {
//         return userRepository.findByEmail(email);
//     }
// }
