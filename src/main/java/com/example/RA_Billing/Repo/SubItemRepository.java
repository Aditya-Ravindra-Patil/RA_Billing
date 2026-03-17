package com.example.RA_Billing.Repo;


import com.example.RA_Billing.Model.SubItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubItemRepository extends JpaRepository<SubItem, Long> {

    List<SubItem> findByItemId(Long itemId);

}
