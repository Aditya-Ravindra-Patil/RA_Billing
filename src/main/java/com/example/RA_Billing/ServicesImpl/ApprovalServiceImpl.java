package com.example.RA_Billing.ServicesImpl;


import com.example.RA_Billing.DTO.ApprovalDto;
import com.example.RA_Billing.Model.*;
import com.example.RA_Billing.Repo.*;
import com.example.RA_Billing.Services.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalServiceImpl implements ApprovalService {

    private final RABillRepository raBillRepository;
    private final ApprovalRepository approvalRepository;

    // Submit Bill
    public RABill submitBill(Long billId) {

        RABill bill = raBillRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        bill.setStatus("UNDER_APPROVAL");

        return raBillRepository.save(bill);
    }

    // Approve Bill
    public Approval approveBill(Long billId, ApprovalDto dto) {

        RABill bill = raBillRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        Approval approval = Approval.builder()
                .raBill(bill)
                .role(Enum.valueOf(com.example.RA_Billing.ENUM.Role.class, dto.getRole()))
                .remarks(dto.getRemarks())
                .status("APPROVED")
                .build();

        return approvalRepository.save(approval);
    }

    // Reject Bill
    public Approval rejectBill(Long billId, ApprovalDto dto) {

        RABill bill = raBillRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        bill.setStatus("REJECTED");

        raBillRepository.save(bill);

        Approval approval = Approval.builder()
                .raBill(bill)
                .role(Enum.valueOf(com.example.RA_Billing.ENUM.Role.class, dto.getRole()))
                .remarks(dto.getRemarks())
                .status("REJECTED")
                .build();

        return approvalRepository.save(approval);
    }

    // Approval History
    public List<Approval> getApprovalHistory(Long billId) {

        return approvalRepository.findByRaBillId(billId);
    }
}