package com.examly.springapp.repository;

import com.examly.springapp.model.LearningTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningTaskRepository extends JpaRepository<LearningTask, Long> {
    List<LearningTask> findByEmployeeSkill_Id(Long employeeSkillId);
}


