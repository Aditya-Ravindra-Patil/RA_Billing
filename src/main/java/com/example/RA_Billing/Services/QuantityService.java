package com.example.RA_Billing.Services;

public interface QuantityService {
    Double getSubItemQuantity(Long subItemId);

    Double getItemQuantity(Long itemId);

    Double getStageQuantity(Long stageId);



}
