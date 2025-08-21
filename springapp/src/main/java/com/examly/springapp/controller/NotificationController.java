package com.examly.springapp.controller;

import com.examly.springapp.model.Notification;
import com.examly.springapp.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {
    @Autowired private NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Notification> create(@RequestParam Long userId, @RequestParam String message) {
        return ResponseEntity.ok(notificationService.create(userId, message));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> list(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.listForUser(userId));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id) {
        notificationService.markRead(id);
        return ResponseEntity.noContent().build();
    }
}


