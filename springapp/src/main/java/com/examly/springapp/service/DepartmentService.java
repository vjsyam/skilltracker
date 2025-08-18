package com.examly.springapp.service;

import com.examly.springapp.model.Department;
import com.examly.springapp.model.Employee;
import com.examly.springapp.repository.DepartmentRepository;
import com.examly.springapp.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Optional<Department> getDepartmentById(Long id) {
        return departmentRepository.findById(id);
    }

    public Department createDepartment(Department department) {
        Set<Employee> resolvedEmployees = new HashSet<>();

        if (department.getEmployees() != null) {
            for (Employee e : department.getEmployees()) {
                Employee found = employeeRepository.findById(e.getId())
                        .orElseThrow(() -> new RuntimeException("Employee not found with id: " + e.getId()));
                found.setDepartment(department);
                resolvedEmployees.add(found);
            }
        }

        department.setEmployees(resolvedEmployees);
        return departmentRepository.save(department);
    }

    @Transactional
    public Department updateDepartment(Long id, Department updatedDepartment) {
        // 1. First verify department exists with relations loaded
        Department existingDept = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
        
        // 2. Force load employees to manage relationships
        existingDept.getEmployees().size(); // Trigger lazy loading
        
        // 3. Update simple fields
        existingDept.setName(updatedDepartment.getName());
        
        // 4. Clear existing relationships
        Set<Employee> currentEmployees = new HashSet<>(existingDept.getEmployees());
        for (Employee emp : currentEmployees) {
            emp.setDepartment(null);
            employeeRepository.saveAndFlush(emp); // Force immediate persist
        }
        existingDept.getEmployees().clear();
        departmentRepository.saveAndFlush(existingDept); // Force flush
        
        // 5. Add new relationships
        if (updatedDepartment.getEmployees() != null) {
            for (Employee e : updatedDepartment.getEmployees()) {
                Employee employee = employeeRepository.findById(e.getId())
                        .orElseThrow(() -> new RuntimeException("Employee not found: " + e.getId()));
                employee.setDepartment(existingDept);
                employeeRepository.saveAndFlush(employee); // Force immediate persist
                existingDept.getEmployees().add(employee);
            }
        }
        
        // 6. Final save
        return departmentRepository.saveAndFlush(existingDept);
    }

    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        department.getEmployees().forEach(emp -> emp.setDepartment(null));
        departmentRepository.delete(department);
    }
}