package com.example.RA_Billing.Controller;

import com.example.RA_Billing.Services.ExcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExcelController {

    private final ExcelService excelService;

    @GetMapping("/ra-bills/{raBillId}/excel")
    public ResponseEntity<InputStreamResource> exportExcel(
            @PathVariable Long raBillId) throws Exception {

        InputStreamResource file =
                new InputStreamResource(excelService.generateExcel(raBillId));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=ra-bill.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file);
    }
}