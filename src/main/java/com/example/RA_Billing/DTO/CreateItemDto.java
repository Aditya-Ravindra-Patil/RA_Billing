package com.example.RA_Billing.DTO;

import com.example.RA_Billing.Model.Project_Items;
import com.example.RA_Billing.Model.Stage;
import lombok.Data;

@Data
public class CreateItemDto {
    private String itemNo;
    private String description;
    private String unit;
    private Double tenderRate;

    public Project_Items building(Stage stage){
        return Project_Items.builder()
                .itemNo(this.itemNo)
                .description(this.description)
                .unit(this.unit)
                .tenderRate(this.tenderRate)
                .stage(stage)
                .build();
    }
}
