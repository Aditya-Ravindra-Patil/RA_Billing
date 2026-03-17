package com.example.RA_Billing.Controller;

import com.example.RA_Billing.DTO.ApprovalDto;
import com.example.RA_Billing.Model.Approval;
import com.example.RA_Billing.Model.RABill;
import com.example.RA_Billing.Services.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService approvalService;

    // Submit RA Bill
    @PostMapping("/ra-bills/{raBillId}/submit")
    public RABill submitBill(@PathVariable Long raBillId){

        return approvalService.submitBill(raBillId);
    }

    // Approve Bill
    @PostMapping("/ra-bills/{raBillId}/approve")
    public Approval approveBill(
            @PathVariable Long raBillId,
            @RequestBody ApprovalDto dto){

        return approvalService.approveBill(raBillId, dto);
    }

    // Reject Bill
    @PostMapping("/ra-bills/{raBillId}/reject")
    public Approval rejectBill(
            @PathVariable Long raBillId,
            @RequestBody ApprovalDto dto){

        return approvalService.rejectBill(raBillId, dto);
    }

    // Approval History
    @GetMapping("/ra-bills/{raBillId}/approvals")
    public List<Approval> getApprovals(@PathVariable Long raBillId){

        return approvalService.getApprovalHistory(raBillId);
    }
}