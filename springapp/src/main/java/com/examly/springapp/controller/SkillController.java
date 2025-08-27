package com.examly.springapp.controller;

import com.examly.springapp.dto.PaginatedResponse;
import com.examly.springapp.model.Skill;
import com.examly.springapp.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Arrays;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Collections;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "http://localhost:3000")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @PostMapping
    public ResponseEntity<Skill> createSkill(@RequestBody Skill skill) {
        Skill created = skillService.createSkill(skill);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<Skill>> getAllSkills(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        PaginatedResponse<Skill> response = skillService.getAllSkillsPaginated(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Skill> getSkillById(@PathVariable Long id) {
        Skill skill = skillService.getSkillById(id);
        return ResponseEntity.ok(skill);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable Long id, @RequestBody Skill updatedSkill) {
        Skill updated = skillService.updateSkill(id, updatedSkill);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }

    // Course-like content: simple static content per skill for now
    @GetMapping("/{id}/content")
    public ResponseEntity<Map<String, Object>> getSkillContent(@PathVariable Long id) {
        Skill skill = skillService.getSkillById(id);
        String name = skill.getName();
        String nameLower = name == null ? "" : name.toLowerCase();
        String descLower = skill.getDescription() == null ? "" : skill.getDescription().toLowerCase();
        // Derive a category from name/description keywords since Skill has no category field
        String categoryLower = "general";
        String hay = nameLower + " " + descLower;
        if (hay.contains("react") || hay.contains("angular") || hay.contains("vue") || hay.contains("css") || hay.contains("frontend") || hay.contains("ui")) {
            categoryLower = "frontend";
        } else if (hay.contains("spring") || hay.contains("java") || hay.contains("node") || hay.contains("express") || hay.contains("backend") || hay.contains("api")) {
            categoryLower = "backend";
        } else if (hay.contains("mysql") || hay.contains("postgres") || hay.contains("mongodb") || hay.contains("database") || hay.contains("sql")) {
            categoryLower = "database";
        } else if (hay.contains("docker") || hay.contains("kubernetes") || hay.contains("devops") || hay.contains("ci/cd") || hay.contains("terraform") || hay.contains("nginx")) {
            categoryLower = "devops";
        } else if (hay.contains("security") || hay.contains("oauth") || hay.contains("jwt") || hay.contains("auth")) {
            categoryLower = "security";
        }

        // Category-specific seed content (Java 8 compatible)
        List<String> baseNotes;
        if ("frontend".equals(categoryLower)) {
            baseNotes = Arrays.asList(
                    "Understand component composition patterns in " + name,
                    "State management approaches relevant to " + name,
                    "Accessibility (a11y) considerations when using " + name,
                    "Performance optimizations (memoization, virtualization) in " + name
            );
        } else if ("backend".equals(categoryLower)) {
            baseNotes = Arrays.asList(
                    "Design RESTful APIs integrating " + name,
                    "Error handling and validation best practices with " + name,
                    "Persistence patterns and data modeling alongside " + name,
                    "Observability (logs/metrics/traces) in services built with " + name
            );
        } else if ("database".equals(categoryLower)) {
            baseNotes = Arrays.asList(
                    "Normalization vs denormalization trade-offs with " + name,
                    "Indexing strategies and query plans in " + name,
                    "Backup/restore and migration routines for " + name
            );
        } else if ("devops".equals(categoryLower)) {
            baseNotes = Arrays.asList(
                    "Containerization and CI/CD pipelines including " + name,
                    "Secrets and configuration management with " + name,
                    "Monitoring and alerting for workloads using " + name
            );
        } else if ("security".equals(categoryLower)) {
            baseNotes = Arrays.asList(
                    "AuthN/AuthZ flows relevant to " + name,
                    "Input validation and OWASP concerns with " + name,
                    "Secure configuration and dependency management in " + name
            );
        } else {
            baseNotes = Arrays.asList(
                    "Core concepts and mental models for " + name,
                    "Common pitfalls and anti-patterns in " + name,
                    "Project structure and best practices around " + name
            );
        }

        List<String> baseHints = Arrays.asList(
                "Start with a minimal example using " + name,
                "Use official docs quickstart for " + name,
                "Create a checklist for features you’ll build with " + name,
                "Compare two approaches and benchmark briefly"
        );

        List<String> baseResources = Arrays.asList(
                name + " official documentation",
                name + " curated tutorial",
                name + " sample repo on GitHub"
        );

        // Randomize selections so content varies
        List<String> notes = new ArrayList<>(baseNotes);
        List<String> hints = new ArrayList<>(baseHints);
        List<String> resources = new ArrayList<>(baseResources);
        Collections.shuffle(notes);
        Collections.shuffle(hints);
        Collections.shuffle(resources);

        int notesCount = Math.min(notes.size(), 3);
        int hintsCount = Math.min(hints.size(), 3);
        int resCount = Math.min(resources.size(), 2);

        Map<String, Object> body = new HashMap<String, Object>();
        body.put("skillId", id);
        body.put("title", name + " Learning Guide");
        body.put("notes", notes.subList(0, notesCount));
        body.put("hints", hints.subList(0, hintsCount));
        body.put("resources", resources.subList(0, resCount));
        return ResponseEntity.ok(body);
    }
}