package com.example.RA_Billing.Model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class RABill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String billNo;

    private Double totalAmount;

    private String status;

    @ManyToOne
    private Stage stage;

}
