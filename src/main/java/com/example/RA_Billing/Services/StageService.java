package com.example.RA_Billing.Services;


import com.example.RA_Billing.DTO.CreateProjectDto;
import com.example.RA_Billing.DTO.CreateStageDto;
import com.example.RA_Billing.Model.Stage;

public interface StageService {

    CreateStageDto createStage(Long projectId, CreateStageDto createStageDto);
}
