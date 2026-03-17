package com.example.RA_Billing.Controller;


import com.example.RA_Billing.DTO.AbstractDto;
import com.example.RA_Billing.Model.RABill;
import com.example.RA_Billing.Services.RABillService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RABillController {

    private final RABillService raBillService;

    // Generate RA Bill
    @PostMapping("/stages/{stageId}/generate-ra-bill")
    public RABill generateBill(@PathVariable Long stageId){

        return raBillService.generateBill(stageId);
    }

    // Get RA Bill
    @GetMapping("/ra-bills/{raBillId}")
    public RABill getBill(@PathVariable Long raBillId){

        return raBillService.getBill(raBillId);
    }

    // Get Project Bills
    @GetMapping("/projects/{projectId}/ra-bills")
    public List<RABill> getProjectBills(@PathVariable Long projectId){

        return raBillService.getProjectBills(projectId);
    }

    // Get Abstract
    @GetMapping("/ra-bills/{raBillId}/abstract")
    public List<AbstractDto> getAbstract(@PathVariable Long raBillId){

        return raBillService.getAbstract(raBillId);
    }
}