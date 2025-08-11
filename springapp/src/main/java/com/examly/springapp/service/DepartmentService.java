package com.examly.springapp.service;

import com.examly.springapp.model.Department;
import com.examly.springapp.model.Employee;
import com.examly.springapp.repository.DepartmentRepository;
import com.examly.springapp.repository.EmployeeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
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
                resolvedEmployees.add(found);
            }
        }

        department.setEmployees(resolvedEmployees);
        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, Department updatedDepartment) {
        return departmentRepository.findById(id)
                .map(dept -> {
                    dept.setName(updatedDepartment.getName());

                    Set<Employee> resolvedEmployees = new HashSet<>();
                    if (updatedDepartment.getEmployees() != null) {
                        for (Employee e : updatedDepartment.getEmployees()) {
                            Employee found = employeeRepository.findById(e.getId())
                                    .orElseThrow(() -> new RuntimeException("Employee not found with id: " + e.getId()));
                            resolvedEmployees.add(found);
                        }
                    }

                    dept.setEmployees(resolvedEmployees);
                    return departmentRepository.save(dept);
                })
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
    }

    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }
}
