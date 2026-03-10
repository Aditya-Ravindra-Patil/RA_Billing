package com.example.RA_Billing.Repo;

import com.example.RA_Billing.Model.Project_Items;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectItemRepository extends JpaRepository<Project_Items, Long> {
}