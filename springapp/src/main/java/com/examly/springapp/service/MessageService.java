package com.examly.springapp.service;

import com.examly.springapp.model.Message;
import com.examly.springapp.repository.MessageRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository repo;

    public MessageService(MessageRepository repo) {
        this.repo = repo;
    }

    public Message saveMessage(Message message) {
        return repo.save(message);
    }

    public List<Message> getAllMessages() {
        return repo.findAll();
    }
}
