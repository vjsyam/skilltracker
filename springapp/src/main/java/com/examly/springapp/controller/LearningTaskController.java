package com.examly.springapp.controller;

import com.examly.springapp.model.LearningTask;
import com.examly.springapp.service.LearningTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class LearningTaskController {

    @Autowired
    private LearningTaskService learningTaskService;

    @GetMapping("/employee-skill/{employeeSkillId}")
    public List<LearningTask> list(@PathVariable Long employeeSkillId) {
        return learningTaskService.listForEmployeeSkill(employeeSkillId);
    }

    @PutMapping("/{id}/status")
    public LearningTask updateStatus(@PathVariable Long id, @RequestParam LearningTask.TaskStatus status) {
        return learningTaskService.updateStatus(id, status);
    }
}


