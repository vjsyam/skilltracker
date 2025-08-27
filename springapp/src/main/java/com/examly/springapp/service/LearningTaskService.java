package com.examly.springapp.service;

import com.examly.springapp.model.EmployeeSkill;
import com.examly.springapp.model.LearningTask;
import com.examly.springapp.repository.LearningTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class LearningTaskService {

    @Autowired
    private LearningTaskRepository learningTaskRepository;

    public List<LearningTask> listForEmployeeSkill(Long employeeSkillId) {
        return learningTaskRepository.findByEmployeeSkill_Id(employeeSkillId);
    }

    public List<LearningTask> generateDefaultTasksFor(EmployeeSkill employeeSkill) {
        if (employeeSkill == null || employeeSkill.getId() == null || employeeSkill.getSkill() == null) return List.of();
        String name = employeeSkill.getSkill().getName();
        String[] verbs = new String[]{"Read","Watch","Complete","Build","Refactor","Implement","Document","Review","Pair","Practice","Benchmark","Debug"};
        String[] objects = new String[]{
                "intro to "+name,
                "an advanced guide on "+name,
                "a mini project using "+name,
                name+" best practices",
                name+" patterns",
                "tests for a "+name+" project",
                name+" official docs",
                name+" community resources",
                "a kata with "+name,
                "performance tips for "+name,
                "error handling in "+name
        };
        int count = 7 + (int) (Math.random() * 4); // 7-10
        List<LearningTask> toSave = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            String title = verbs[(int)(Math.random()*verbs.length)] + " " + objects[(int)(Math.random()*objects.length)];
            LearningTask t = new LearningTask();
            t.setEmployeeSkill(employeeSkill);
            t.setTitle(title);
            t.setStatus(LearningTask.TaskStatus.PENDING);
            t.setCreatedAt(LocalDateTime.now());
            toSave.add(t);
        }
        return learningTaskRepository.saveAll(toSave);
    }

    public LearningTask updateStatus(Long id, LearningTask.TaskStatus status) {
        return learningTaskRepository.findById(id).map(t -> {
            t.setStatus(status);
            if (status == LearningTask.TaskStatus.COMPLETED) {
                t.setCompletedAt(LocalDateTime.now());
            }
            return learningTaskRepository.save(t);
        }).orElseThrow(() -> new RuntimeException("Task not found: " + id));
    }
}


