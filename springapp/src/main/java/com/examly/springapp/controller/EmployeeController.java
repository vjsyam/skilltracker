package com.examly.springapp.controller;

import com.examly.springapp.dto.EmployeeDTO;
import com.examly.springapp.dto.PaginatedResponse;
import com.examly.springapp.model.Employee;
import com.examly.springapp.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {
    @Autowired private EmployeeService employeeService;

    @GetMapping
    public PaginatedResponse<EmployeeDTO> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return employeeService.getAllEmployeesPaginated(pageable);
    }

    @GetMapping("/{id}")
    public EmployeeDTO getById(@PathVariable Long id) { return employeeService.getEmployeeById(id); }

    @PostMapping
    public EmployeeDTO create(@RequestBody Employee payload) { return employeeService.createEmployee(payload); }

    @PutMapping("/{id}")
    public EmployeeDTO update(@PathVariable Long id, @RequestBody Employee payload) { return employeeService.updateEmployee(id, payload); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { employeeService.deleteEmployee(id); }
}
