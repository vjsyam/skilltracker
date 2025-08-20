package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            // Validate role
            if (user.getRole() == null || user.getRole().trim().isEmpty()) {
                user.setRole("EMPLOYEE"); // Default role
            }
            
            // Check if user already exists
            User existingUser = userService.findByEmail(user.getEmail());
            if (existingUser != null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User with this email already exists");
                return ResponseEntity.badRequest().body(error);
            }

            User createdUser = userService.createUser(user);
            
            // Don't return password in response
            createdUser.setPassword(null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("user", createdUser);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        try {
            return ResponseEntity.ok("Backend is working! Database connection: OK");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");



            if (email == null || password == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email and password are required");
                return ResponseEntity.badRequest().body(error);
            }

            User user = userService.authenticateUser(email, password);
            
            if (user != null) {
                // Don't return password in response
                user.setPassword(null);
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful");
                response.put("user", user);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid email or password");
                return ResponseEntity.badRequest().body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
