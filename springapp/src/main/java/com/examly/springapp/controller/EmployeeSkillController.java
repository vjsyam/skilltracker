package com.examly.springapp.controller;

import com.examly.springapp.model.EmployeeSkill;
import com.examly.springapp.service.EmployeeSkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employee-skills")
@CrossOrigin(origins = "http://localhost:3000")

public class EmployeeSkillController {

    @Autowired
    private EmployeeSkillService employeeSkillService;

    @GetMapping
    public List<EmployeeSkill> getAllEmployeeSkills() {
        return employeeSkillService.getAllEmployeeSkills();
    }

    @GetMapping("/{id}")
    public Optional<EmployeeSkill> getEmployeeSkillById(@PathVariable Long id) {
        return employeeSkillService.getEmployeeSkillById(id);
    }

    @PostMapping
    public EmployeeSkill createEmployeeSkill(@RequestBody EmployeeSkill employeeSkill) {
        return employeeSkillService.createEmployeeSkill(employeeSkill);
    }

    @PutMapping("/{id}")
    public EmployeeSkill updateEmployeeSkill(@PathVariable Long id, @RequestBody EmployeeSkill updated) {
        return employeeSkillService.updateEmployeeSkill(id, updated);
    }

    @DeleteMapping("/{id}")
    public void deleteEmployeeSkill(@PathVariable Long id) {
        employeeSkillService.deleteEmployeeSkill(id);
    }

    @GetMapping("/employee/{employeeId}")
    public List<EmployeeSkill> getByEmployee(@PathVariable Long employeeId) {
        return employeeSkillService.getByEmployeeId(employeeId);
    }

    // Promote a skill to profile once learning is complete (idempotent)
    @PostMapping("/promote")
    public EmployeeSkill promote(@RequestParam Long employeeId, @RequestParam Long skillId) {
        return employeeSkillService.promoteIfNotExists(employeeId, skillId);
    }
}
