package com.example.RA_Billing.Services;

import com.example.RA_Billing.DTO.ApprovalDto;
import com.example.RA_Billing.Model.Approval;
import com.example.RA_Billing.Model.RABill;

import java.util.List;

public interface ApprovalService {
    RABill submitBill(Long billId);

    Approval approveBill(Long billId, ApprovalDto dto);

    Approval rejectBill(Long billId, ApprovalDto dto);

    List<Approval> getApprovalHistory(Long billId);



}