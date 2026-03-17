package com.example.RA_Billing.Controller;

import com.example.RA_Billing.Services.QuantityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuantityController {

    private final QuantityService quantityService;

    // SubItem Quantity
    @GetMapping("/subitems/{subItemId}/quantity")
    public Double getSubItemQuantity(@PathVariable Long subItemId) {

        return quantityService.getSubItemQuantity(subItemId);
    }

    // Item Quantity
    @GetMapping("/items/{itemId}/quantity")
    public Double getItemQuantity(@PathVariable Long itemId) {

        return quantityService.getItemQuantity(itemId);
    }

    // Stage Quantity
    @GetMapping("/stages/{stageId}/quantity")
    public Double getStageQuantity(@PathVariable Long stageId) {

        return quantityService.getStageQuantity(stageId);
    }
}