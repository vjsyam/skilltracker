package com.examly.springapp.dto;

import java.util.Set;
import java.util.stream.Collectors;
import com.examly.springapp.model.Employee;
import com.examly.springapp.model.Skill;

public class EmployeeDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long managerId;
    private String managerName;
    private Long departmentId;
    private String departmentName;
    private Set<Long> skillIds;
    private Set<String> skillNames;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public Set<Long> getSkillIds() {
        return skillIds;
    }

    public void setSkillIds(Set<Long> skillIds) {
        this.skillIds = skillIds;
    }

    public Set<String> getSkillNames() {
        return skillNames;
    }

    public void setSkillNames(Set<String> skillNames) {
        this.skillNames = skillNames;
    }

    public EmployeeDTO(Employee e) {
        this.id = e.getId();
        if (e.getUser() != null) { this.userId = e.getUser().getId(); this.userName = e.getUser().getName(); this.userEmail = e.getUser().getEmail(); }
        if (e.getManager() != null) { this.managerId = e.getManager().getId(); this.managerName = e.getManager().getName(); }
        if (e.getDepartment() != null) { this.departmentId = e.getDepartment().getId(); this.departmentName = e.getDepartment().getName(); }
        this.skillIds = e.getSkills() != null ? e.getSkills().stream().map(Skill::getId).collect(Collectors.toSet()) : null;
        this.skillNames = e.getSkills() != null ? e.getSkills().stream().map(Skill::getName).collect(Collectors.toSet()) : null;
    }

    // getters & setters omitted for brevity — add them
}
