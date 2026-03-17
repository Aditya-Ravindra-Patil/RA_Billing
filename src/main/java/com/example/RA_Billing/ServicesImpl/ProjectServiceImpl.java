package com.example.RA_Billing.ServicesImpl;

import com.example.RA_Billing.DTO.CreateProjectDto;
import com.example.RA_Billing.Model.Project;
import com.example.RA_Billing.Repo.ProjectRepository;
import com.example.RA_Billing.Services.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository repository;

    public List<Project> getAllProjects(){
        return repository.findAll();
    }

    public Project saveProject(CreateProjectDto createProjectDto){

//        Project project=createProjectDto.building();

        return repository.save(createProjectDto.building());

    }

    public void deleteProject(Long id){
        repository.deleteById(id);
    }
}
