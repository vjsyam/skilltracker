package com.examly.springapp.controller;

import com.examly.springapp.dto.ReportDTO;
import com.examly.springapp.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {
    @Autowired private ReportService reportService;
    @GetMapping public ReportDTO getReports() { return reportService.generateReports(); }
}

