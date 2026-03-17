package com.example.RA_Billing.Controller;

import com.example.RA_Billing.DTO.MeasurementDTO;
import com.example.RA_Billing.Model.MeasurementBookLog;
import com.example.RA_Billing.Services.MeasurementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MeasurementController {

    private final MeasurementService measurementService;

    // Add Measurement
    @PostMapping("/measurements")
    public MeasurementBookLog addMeasurement(
            @RequestBody MeasurementDTO dto) {

        return measurementService.addMeasurement(dto);
    }

    // Get Measurements of SubItem
    @GetMapping("/subitems/{subItemId}/measurements")
    public List<MeasurementBookLog> getMeasurements(
            @PathVariable Long subItemId) {

        return measurementService.getMeasurements(subItemId);
    }

    // Update Measurement
    @PutMapping("/measurements/{measurementId}")
    public MeasurementBookLog updateMeasurement(
            @PathVariable Long measurementId,
            @RequestBody MeasurementDTO dto) {

        return measurementService.updateMeasurement(measurementId, dto);
    }

    // Delete Measurement
    @DeleteMapping("/measurements/{measurementId}")
    public String deleteMeasurement(
            @PathVariable Long measurementId) {

        measurementService.deleteMeasurement(measurementId);

        return "Measurement deleted successfully";
    }
}