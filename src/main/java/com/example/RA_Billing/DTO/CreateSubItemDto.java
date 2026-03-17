package com.example.RA_Billing.DTO;

import lombok.Data;

@Data
public class CreateSubItemDto {

    private String subItemNo;

    private String description;

    private String unit;

    private Double rate;

}
