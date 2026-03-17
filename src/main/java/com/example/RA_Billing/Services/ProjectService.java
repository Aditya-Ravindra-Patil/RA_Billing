package com.example.RA_Billing.Services;

import com.example.RA_Billing.DTO.CreateProjectDto;
import com.example.RA_Billing.Model.Project;

import java.util.List;

public interface ProjectService {

    List<Project> getAllProjects();

    Project saveProject(CreateProjectDto createProjectDto);

    void deleteProject(Long id);
}
