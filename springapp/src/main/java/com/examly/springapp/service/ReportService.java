package com.examly.springapp.service;

import com.examly.springapp.dto.ReportDTO;
import com.examly.springapp.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public ReportDTO generateReports() {
        // Group employees by department
        Map<String, Long> employeesPerDepartment = employeeRepository.findAll().stream()
                .filter(emp -> emp.getDepartment() != null)
                .collect(Collectors.groupingBy(
                        emp -> emp.getDepartment().getName(),
                        Collectors.counting()
                ));

        // Count skills across all employees
        Map<String, Long> skillsCount = employeeRepository.findAll().stream()
                .flatMap(emp -> emp.getSkills().stream())
                .collect(Collectors.groupingBy(
                        skill -> skill.getName(),
                        Collectors.counting()
                ));

        return new ReportDTO(employeesPerDepartment, skillsCount);
    }
}


