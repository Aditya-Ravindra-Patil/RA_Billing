package com.example.RA_Billing.Services;

import com.example.RA_Billing.DTO.MeasurementDTO;
import com.example.RA_Billing.Model.MeasurementBookLog;

import java.util.List;

public interface MeasurementService {
    MeasurementBookLog addMeasurement(MeasurementDTO dto);

    List<MeasurementBookLog> getMeasurements(Long subItemId);

    MeasurementBookLog updateMeasurement(Long measurementId, MeasurementDTO dto);

    void deleteMeasurement(Long measurementId);
}
