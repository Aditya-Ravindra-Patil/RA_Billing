package com.example.RA_Billing.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class SubItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subItemNo;

    private String description;

    private String unit;

    private Double rate;

    @ManyToOne
    @JsonBackReference
    private Project_Items item;

    @OneToMany(mappedBy = "subItem")
    @JsonManagedReference
    private List<MeasurementBookLog> measurements;
}
