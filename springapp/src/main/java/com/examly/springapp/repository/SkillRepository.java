package com.examly.springapp.repository;

import com.examly.springapp.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    
}