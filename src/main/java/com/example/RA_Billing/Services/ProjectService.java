package com.example.RA_Billing.Services;

import com.example.RA_Billing.Model.Project;

import java.util.List;

public interface ProjectService {

    List<Project> getAllProjects();

    Project saveProject(Project project);

    void deleteProject(Long id);
}
