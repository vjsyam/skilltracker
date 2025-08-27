package com.examly.springapp.repository;

import com.examly.springapp.model.EmployeeSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeSkillRepository extends JpaRepository<EmployeeSkill, Long> {
    @Query("select es from EmployeeSkill es where es.employee.id = :employeeId")
    List<EmployeeSkill> findByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("select count(es) > 0 from EmployeeSkill es where es.employee.id = :employeeId and es.skill.id = :skillId")
    boolean existsByEmployeeIdAndSkillId(@Param("employeeId") Long employeeId, @Param("skillId") Long skillId);
}