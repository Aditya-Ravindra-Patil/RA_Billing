package com.example.RA_Billing.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class MeasurementBookLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double length;

    private Double breadth;

    private Double depth;

    private Double volume;

    private Double chainageFrom;

    private Double chainageTo;

    private LocalDate dateFrom;

    private LocalDate dateTo;

    @ManyToOne
    @JsonBackReference
    private SubItem subItem;

}
