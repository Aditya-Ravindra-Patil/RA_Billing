package com.example.RA_Billing.Repo;

import com.example.RA_Billing.Model.RABill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RABillRepository extends JpaRepository<RABill, Long> {

    List<RABill> findByStageProjectId(Long projectId);

}