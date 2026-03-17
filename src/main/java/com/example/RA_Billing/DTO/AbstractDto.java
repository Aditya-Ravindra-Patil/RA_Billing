package com.example.RA_Billing.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AbstractDto {

    private String itemNo;
    private String subItemNo;

    private Double quantity;
    private Double rate;
    private Double amount;

}