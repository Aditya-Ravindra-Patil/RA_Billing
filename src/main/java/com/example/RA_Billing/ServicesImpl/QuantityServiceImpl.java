package com.example.RA_Billing.ServicesImpl;


import com.example.RA_Billing.Model.Project_Items;
import com.example.RA_Billing.Model.SubItem;
import com.example.RA_Billing.Repo.ItemRepository;
import com.example.RA_Billing.Repo.MeasurementRepository;
import com.example.RA_Billing.Repo.SubItemRepository;
import com.example.RA_Billing.Services.QuantityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuantityServiceImpl implements QuantityService {

    private final MeasurementRepository measurementRepository;
    private final SubItemRepository subItemRepository;
    private final ItemRepository itemRepository;

    // SubItem Quantity
    public Double getSubItemQuantity(Long subItemId) {

        Double qty = measurementRepository.getSubItemQuantity(subItemId);

        return qty == null ? 0.0 : qty;
    }

    // Item Quantity
    public Double getItemQuantity(Long itemId) {

        List<SubItem> subItems = subItemRepository.findByItemId(itemId);

        double total = 0;

        for(SubItem subItem : subItems) {

            Double qty = measurementRepository.getSubItemQuantity(subItem.getId());

            if(qty != null)
                total += qty;
        }

        return total;
    }

    // Stage Quantity
    public Double getStageQuantity(Long stageId) {

        List<Project_Items> items = itemRepository.findByStageId(stageId);

        double total = 0;

        for(Project_Items item : items) {

            total += getItemQuantity(item.getId());
        }

        return total;
    }
}
