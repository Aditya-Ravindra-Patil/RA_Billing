package com.example.RA_Billing.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MeasurementDTO {

    private Long subItemId;

    private Double length;
    private Double breadth;
    private Double depth;

    private Double chainageFrom;
    private Double chainageTo;

    private LocalDate dateFrom;
    private LocalDate dateTo;
}