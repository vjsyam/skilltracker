package com.examly.springapp.service;

import com.examly.springapp.dto.PaginatedResponse;
import com.examly.springapp.model.Skill;
import com.examly.springapp.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public PaginatedResponse<Skill> getAllSkillsPaginated(Pageable pageable) {
        Page<Skill> skillPage = skillRepository.findAll(pageable);
        return new PaginatedResponse<>(
            skillPage.getContent(),
            pageable.getPageNumber(),
            pageable.getPageSize(),
            skillPage.getTotalElements()
        );
    }

    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + id));
    }

    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    public Skill updateSkill(Long id, Skill updatedSkill) {
        return skillRepository.findById(id)
                .map(skill -> {
                    skill.setName(updatedSkill.getName());
                    skill.setDescription(updatedSkill.getDescription());
                    return skillRepository.save(skill);
                })
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + id));
    }

    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }
}
