package com.example.RA_Billing.Repo;

import com.example.RA_Billing.Model.MeasurementBookLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MeasurementRepository
        extends JpaRepository<MeasurementBookLog, Long> {

    List<MeasurementBookLog> findBySubItemId(Long subItemId);

    @Query("SELECT SUM(m.volume) FROM MeasurementBookLog m WHERE m.subItem.id = :subItemId")
    Double getSubItemQuantity(Long subItemId);

}