package com.example.RA_Billing.Model;

import jakarta.persistence.*;

@Entity
public class Project_Items {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;
    private String unit;
    private Double rate;

    @ManyToOne
    private Project project;
}


