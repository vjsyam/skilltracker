package com.examly.springapp.dto;

import java.util.Map;

public class ReportDTO {
    private Map<String, Long> employeesPerDepartment;
    private Map<String, Long> skillsCount;

    public ReportDTO(Map<String, Long> employeesPerDepartment, Map<String, Long> skillsCount) {
        this.employeesPerDepartment = employeesPerDepartment;
        this.skillsCount = skillsCount;
    }

    public Map<String, Long> getEmployeesPerDepartment() {
        return employeesPerDepartment;
    }

    public void setEmployeesPerDepartment(Map<String, Long> employeesPerDepartment) {
        this.employeesPerDepartment = employeesPerDepartment;
    }

    public Map<String, Long> getSkillsCount() {
        return skillsCount;
    }

    public void setSkillsCount(Map<String, Long> skillsCount) {
        this.skillsCount = skillsCount;
    }
}
