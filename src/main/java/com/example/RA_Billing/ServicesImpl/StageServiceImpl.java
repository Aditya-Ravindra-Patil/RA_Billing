package com.example.RA_Billing.ServicesImpl;

import com.example.RA_Billing.DTO.CreateProjectDto;
import com.example.RA_Billing.DTO.CreateStageDto;
import com.example.RA_Billing.Model.Project;
import com.example.RA_Billing.Model.Stage;
import com.example.RA_Billing.Repo.ProjectRepository;
import com.example.RA_Billing.Repo.StageRepository;
import com.example.RA_Billing.Services.StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StageServiceImpl implements StageService {

    @Autowired
    private StageRepository stageRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public CreateStageDto createStage(Long projectId, CreateStageDto createStageDto) {
        Project project=this.projectRepository.findById(projectId).orElseThrow(()-> new RuntimeException("Not Found"));

        stageRepository.save(createStageDto.building(project));
        return createStageDto;
    }
}
