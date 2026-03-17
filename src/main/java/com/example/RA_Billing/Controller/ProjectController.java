package com.example.RA_Billing.Controller;

import com.example.RA_Billing.DTO.CreateProjectDto;
import com.example.RA_Billing.Model.Project;
import com.example.RA_Billing.Services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin("*")
public class ProjectController {

    @Autowired
    private ProjectService service;

    @GetMapping
    public List<Project> getProjects(){
        return service.getAllProjects();
    }

    @PostMapping
    public Project createProject(@RequestBody CreateProjectDto createProjectDto){
        return service.saveProject(createProjectDto);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id){
        service.deleteProject(id);
    }
}
