package com.example.RA_Billing.Repo;

import com.example.RA_Billing.Model.Project_Items;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Project_Items,Long> {

    List<Project_Items> findByStageId(Long stageId);

}
