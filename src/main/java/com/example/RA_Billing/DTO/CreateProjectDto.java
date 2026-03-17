package com.example.RA_Billing.DTO;

import com.example.RA_Billing.Model.Project;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProjectDto {

    private String projectName;
    private String location;


    public Project building(){
        return Project.builder()
                .name(this.projectName)
                .location(this.location)
                .status("INPROGRESS")
                .build();
    }


}
