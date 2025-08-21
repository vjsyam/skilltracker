package com.examly.springapp.service;

import com.examly.springapp.dto.PaginatedResponse;
import com.examly.springapp.model.Message;
import com.examly.springapp.repository.MessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public PaginatedResponse<Message> getAllMessagesPaginated(Pageable pageable) {
        Page<Message> messagePage = repo.findAll(pageable);
        return new PaginatedResponse<>(
            messagePage.getContent(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            messagePage.getTotalElements()
        );
    }
}
