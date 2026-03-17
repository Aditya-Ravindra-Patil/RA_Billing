package com.example.RA_Billing.ServicesImpl;


import com.example.RA_Billing.DTO.MeasurementDTO;
import com.example.RA_Billing.Model.MeasurementBookLog;
import com.example.RA_Billing.Model.SubItem;
import com.example.RA_Billing.Repo.MeasurementRepository;
import com.example.RA_Billing.Repo.SubItemRepository;
import com.example.RA_Billing.Services.MeasurementService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MeasurementServiceImpl implements MeasurementService {

    private final MeasurementRepository measurementRepository;
    private final SubItemRepository subItemRepository;

    // Create Measurement
    public MeasurementBookLog addMeasurement(MeasurementDTO dto) {

        SubItem subItem = subItemRepository.findById(dto.getSubItemId())
                .orElseThrow(() -> new RuntimeException("SubItem not found"));

        Double volume = dto.getLength() *
                dto.getBreadth() *
                dto.getDepth();

        MeasurementBookLog measurement = MeasurementBookLog.builder()
                .length(dto.getLength())
                .breadth(dto.getBreadth())
                .depth(dto.getDepth())
                .volume(volume)
                .chainageFrom(dto.getChainageFrom())
                .chainageTo(dto.getChainageTo())
                .dateFrom(dto.getDateFrom())
                .dateTo(dto.getDateTo())
                .subItem(subItem)
                .build();

        return measurementRepository.save(measurement);
    }

    // Get Measurements of SubItem
    public List<MeasurementBookLog> getMeasurements(Long subItemId) {

        return measurementRepository.findBySubItemId(subItemId);
    }

    // Update Measurement
    public MeasurementBookLog updateMeasurement(Long measurementId, MeasurementDTO dto) {

        MeasurementBookLog measurement = measurementRepository.findById(measurementId)
                .orElseThrow(() -> new RuntimeException("Measurement not found"));

        Double volume = dto.getLength() *
                dto.getBreadth() *
                dto.getDepth();

        measurement.setLength(dto.getLength());
        measurement.setBreadth(dto.getBreadth());
        measurement.setDepth(dto.getDepth());
        measurement.setVolume(volume);
        measurement.setChainageFrom(dto.getChainageFrom());
        measurement.setChainageTo(dto.getChainageTo());
        measurement.setDateFrom(dto.getDateFrom());
        measurement.setDateTo(dto.getDateTo());

        return measurementRepository.save(measurement);
    }

    // Delete Measurement
    public void deleteMeasurement(Long measurementId) {

        measurementRepository.deleteById(measurementId);
    }
}
