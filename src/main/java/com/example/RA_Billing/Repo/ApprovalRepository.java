package com.example.RA_Billing.Repo;

import com.example.RA_Billing.Model.Approval;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApprovalRepository extends JpaRepository<Approval, Long> {

    List<Approval> findByRaBillId(Long raBillId);

}