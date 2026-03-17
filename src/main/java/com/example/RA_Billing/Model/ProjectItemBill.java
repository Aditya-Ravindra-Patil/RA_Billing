package com.example.RA_Billing.Model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class ProjectItemBill {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Double itemBill;

    @OneToOne
    Project_Items projectItems;

    @ManyToOne
    Project project;

}
