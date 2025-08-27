package com.examly.springapp.service;

import com.examly.springapp.model.Employee;
import com.examly.springapp.model.EmployeeSkill;
import com.examly.springapp.model.Skill;
import com.examly.springapp.repository.EmployeeRepository;
import com.examly.springapp.repository.EmployeeSkillRepository;
import com.examly.springapp.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeSkillService {

    @Autowired
    private EmployeeSkillRepository employeeSkillRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private LearningTaskService learningTaskService;

    public List<EmployeeSkill> getAllEmployeeSkills() {
        return employeeSkillRepository.findAll();
    }

    public Optional<EmployeeSkill> getEmployeeSkillById(Long id) {
        return employeeSkillRepository.findById(id);
    }

    public EmployeeSkill createEmployeeSkill(EmployeeSkill employeeSkill) {
        // Resolve Employee
        if (employeeSkill.getEmployee() != null && employeeSkill.getEmployee().getId() != null) {
            Employee emp = employeeRepository.findById(employeeSkill.getEmployee().getId())
                    .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeSkill.getEmployee().getId()));
            employeeSkill.setEmployee(emp);
        }

        // Resolve Skill
        if (employeeSkill.getSkill() != null && employeeSkill.getSkill().getId() != null) {
            Skill skill = skillRepository.findById(employeeSkill.getSkill().getId())
                    .orElseThrow(() -> new RuntimeException("Skill not found with id: " + employeeSkill.getSkill().getId()));
            employeeSkill.setSkill(skill);
        }

        EmployeeSkill saved = employeeSkillRepository.save(employeeSkill);
        // Optionally generate tasks for new link
        learningTaskService.generateDefaultTasksFor(saved);
        return saved;
    }

    public EmployeeSkill updateEmployeeSkill(Long id, EmployeeSkill updated) {
        return employeeSkillRepository.findById(id)
                .map(existing -> {
                    // Resolve and set Employee
                    if (updated.getEmployee() != null && updated.getEmployee().getId() != null) {
                        Employee emp = employeeRepository.findById(updated.getEmployee().getId())
                                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + updated.getEmployee().getId()));
                        existing.setEmployee(emp);
                    }

                    // Resolve and set Skill
                    if (updated.getSkill() != null && updated.getSkill().getId() != null) {
                        Skill skill = skillRepository.findById(updated.getSkill().getId())
                                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + updated.getSkill().getId()));
                        existing.setSkill(skill);
                    }

                    return employeeSkillRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("EmployeeSkill not found with id: " + id));
    }

    public void deleteEmployeeSkill(Long id) {
        employeeSkillRepository.deleteById(id);
    }

    public List<EmployeeSkill> getByEmployeeId(Long employeeId) {
        return employeeSkillRepository.findByEmployeeId(employeeId);
    }

    public EmployeeSkill promoteIfNotExists(Long employeeId, Long skillId) {
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + skillId));

        boolean exists = employeeSkillRepository.existsByEmployeeIdAndSkillId(employeeId, skillId);
        if (exists) {
            // Already linked, return existing or create a lightweight wrapper
            return employeeSkillRepository.findByEmployeeId(employeeId).stream()
                    .filter(es -> es.getSkill() != null && es.getSkill().getId().equals(skillId))
                    .findFirst()
                    .orElseGet(() -> {
                        EmployeeSkill es = new EmployeeSkill();
                        es.setEmployee(emp);
                        es.setSkill(skill);
                        return es;
                    });
        }

        EmployeeSkill es = new EmployeeSkill();
        es.setEmployee(emp);
        es.setSkill(skill);
        return employeeSkillRepository.save(es);
    }
}
