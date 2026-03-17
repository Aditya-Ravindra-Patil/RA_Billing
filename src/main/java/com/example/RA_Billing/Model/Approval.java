package com.example.RA_Billing.Model;

import com.example.RA_Billing.ENUM.Role;
import com.example.RA_Billing.ENUM.Role;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Approval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String remarks;

    private String status;

    @ManyToOne
    private RABill raBill;
}