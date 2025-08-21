package com.examly.springapp.service;

import com.examly.springapp.dto.EmployeeDTO;
import com.examly.springapp.dto.PaginatedResponse;
import com.examly.springapp.model.Employee;
import com.examly.springapp.model.Skill;
import com.examly.springapp.repository.EmployeeRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.DepartmentRepository;
import com.examly.springapp.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EmployeeService {
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private SkillRepository skillRepository;

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAllWithRelations().stream()
                .map(EmployeeDTO::new).collect(Collectors.toList());
    }

    public PaginatedResponse<EmployeeDTO> getAllEmployeesPaginated(Pageable pageable, String q, Long departmentId, Long skillId) {
        // Simple search: name/email/department/skill filtering via repo helpers
        if ((q != null && !q.isBlank()) || departmentId != null || skillId != null) {
            // fallback basic approach: page IDs and fetch with relations
            Page<Long> idPage = employeeRepository.searchIds(q, departmentId, skillId, pageable);
            List<Employee> list = idPage.getContent().isEmpty() ? List.of() : employeeRepository.findAllByIdInWithRelations(idPage.getContent());
            List<EmployeeDTO> dtos = list.stream().map(EmployeeDTO::new).collect(Collectors.toList());
            return new PaginatedResponse<>(dtos, pageable.getPageNumber(), pageable.getPageSize(), idPage.getTotalElements());
        }
        Page<Employee> page = employeeRepository.findAllWithRelationsPaginated(pageable);
        List<EmployeeDTO> dtos = page.getContent().stream().map(EmployeeDTO::new).collect(Collectors.toList());
        return new PaginatedResponse<>(dtos, pageable.getPageNumber(), pageable.getPageSize(), page.getTotalElements());
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee e = employeeRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        return new EmployeeDTO(e);
    }

    @Transactional
    public EmployeeDTO createEmployee(Employee payload) {
        // resolve user
        if (payload.getUser() != null && payload.getUser().getId() != null) {
            payload.setUser(userRepository.findById(payload.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found")));
        }
        // manager
        if (payload.getManager() != null && payload.getManager().getId() != null) {
            payload.setManager(userRepository.findById(payload.getManager().getId())
                    .orElseThrow(() -> new RuntimeException("Manager not found")));
        }
        // department
        if (payload.getDepartment() != null && payload.getDepartment().getId() != null) {
            payload.setDepartment(departmentRepository.findById(payload.getDepartment().getId())
                    .orElseThrow(() -> new RuntimeException("Department not found")));
        }
        // skills
        if (payload.getSkills() != null && !payload.getSkills().isEmpty()) {
            Set<Skill> resolved = payload.getSkills().stream()
                .map(s -> skillRepository.findById(s.getId()).orElseThrow(() -> new RuntimeException("Skill not found: " + s.getId())))
                .collect(Collectors.toSet());
            payload.setSkills(resolved);
        }

        Employee saved = employeeRepository.save(payload);
        // refetch with relations and return DTO
        return employeeRepository.findByIdWithRelations(saved.getId()).map(EmployeeDTO::new)
                .orElseThrow(() -> new RuntimeException("Failed to fetch saved employee"));
    }

    @Transactional
    public EmployeeDTO updateEmployee(Long id, Employee payload) {
        Employee emp = employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found"));
        // same resolution logic as create, but set onto emp
        if (payload.getUser() != null && payload.getUser().getId() != null)
            emp.setUser(userRepository.findById(payload.getUser().getId()).orElseThrow(() -> new RuntimeException("User not found")));
        if (payload.getManager() != null && payload.getManager().getId() != null)
            emp.setManager(userRepository.findById(payload.getManager().getId()).orElseThrow(() -> new RuntimeException("Manager not found")));
        if (payload.getDepartment() != null && payload.getDepartment().getId() != null)
            emp.setDepartment(departmentRepository.findById(payload.getDepartment().getId()).orElseThrow(() -> new RuntimeException("Department not found")));
        if (payload.getSkills() != null) {
            Set<Skill> resolved = payload.getSkills().stream()
                .map(s -> skillRepository.findById(s.getId()).orElseThrow(() -> new RuntimeException("Skill not found: " + s.getId())))
                .collect(Collectors.toSet());
            emp.setSkills(resolved);
        }
        Employee saved = employeeRepository.save(emp);
        return employeeRepository.findByIdWithRelations(saved.getId()).map(EmployeeDTO::new)
                .orElseThrow(() -> new RuntimeException("Failed to fetch updated employee"));
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}
