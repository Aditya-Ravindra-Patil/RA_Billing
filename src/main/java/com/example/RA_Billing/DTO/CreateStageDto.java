package com.example.RA_Billing.DTO;

import com.example.RA_Billing.Model.Project;
import com.example.RA_Billing.Model.Stage;
import lombok.Data;

@Data
public class CreateStageDto {

    private String stageName;
    private Integer stageNo;
    private String raBillNo;

    public Stage building(Project project){
        return Stage.builder()
                .stageNo(this.stageNo)
                .stageName(this.stageName)
                .raBillNo(this.raBillNo)
                .project(project)
                .build();
    }

}
