package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_tasks")
public class LearningTask {

    public enum TaskStatus { PENDING, IN_PROGRESS, COMPLETED, SKIPPED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "employee_skill_id")
    private EmployeeSkill employeeSkill;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime completedAt;

    public LearningTask() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public EmployeeSkill getEmployeeSkill() { return employeeSkill; }
    public void setEmployeeSkill(EmployeeSkill employeeSkill) { this.employeeSkill = employeeSkill; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}


