package com.examly.springapp.controller;

import com.examly.springapp.model.Message;
import com.examly.springapp.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService service;

    public MessageController(MessageService service) {
        this.service = service;
    }

    @PostMapping
    public Message sendMessage(@RequestBody Message message) {
        return service.saveMessage(message);
    }

    @GetMapping
    public List<Message> getMessages() {
        return service.getAllMessages();
    }
}
