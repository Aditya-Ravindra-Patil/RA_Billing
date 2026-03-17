package com.example.RA_Billing.Services;

import com.example.RA_Billing.DTO.CreateSubItemDto;
import com.example.RA_Billing.Model.SubItem;

import java.util.List;

public interface SubItemService {
    SubItem createSubItem(Long itemId, CreateSubItemDto dto);

    List<SubItem> getSubItemsByItem(Long itemId);

    SubItem getSubItem(Long subItemId);

    SubItem updateSubItem(Long subItemId, CreateSubItemDto dto);

    void deleteSubItem(Long subItemId);

}
