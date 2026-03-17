package com.example.RA_Billing.Services;

import com.example.RA_Billing.DTO.AbstractDto;
import com.example.RA_Billing.Model.RABill;

import java.util.List;

public interface RABillService {
    RABill generateBill(Long stageId);

    RABill getBill(Long billId);

    List<RABill> getProjectBills(Long projectId);

    List<AbstractDto> getAbstract(Long raBillId);
}
