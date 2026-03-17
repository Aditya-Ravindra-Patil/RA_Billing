package com.example.RA_Billing.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stageName;

    private Integer stageNo;

    private String raBillNo;

    @ManyToOne
    @JsonBackReference
    private Project project;

    @OneToMany(mappedBy = "stage")
    @JsonManagedReference
    private List<Project_Items> items;
}