package com.example.RA_Billing.Controller;

import com.example.RA_Billing.DTO.CreateStageDto;
import com.example.RA_Billing.Services.StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StageController {

    @Autowired
    private StageService stageService;

    @PostMapping("/projects/{projectId}/stages")
    public CreateStageDto createStage(
            @PathVariable Long projectId,
            @RequestBody CreateStageDto createStageDto) {

        return stageService.createStage(projectId, createStageDto);
    }
}
