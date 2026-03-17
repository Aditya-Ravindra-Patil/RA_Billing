package com.example.RA_Billing.Controller;

import com.example.RA_Billing.DTO.CreateSubItemDto;
import com.example.RA_Billing.Model.SubItem;
import com.example.RA_Billing.Services.SubItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SubItemController {

    private final SubItemService subItemService;

    // Create SubItem
    @PostMapping("/items/{itemId}/subitems")
    public SubItem createSubItem(@PathVariable Long itemId, @RequestBody CreateSubItemDto dto) {
        return subItemService.createSubItem(itemId, dto);
    }

    // Get all SubItems of Item
    @GetMapping("/items/{itemId}/subitems")
    public List<SubItem> getSubItems(@PathVariable Long itemId) {
        return subItemService.getSubItemsByItem(itemId);
    }

    // Get single SubItem
    @GetMapping("/subitems/{subItemId}")
    public SubItem getSubItem(@PathVariable Long subItemId) {
        return subItemService.getSubItem(subItemId);
    }

    // Update SubItem
    @PutMapping("/subitems/{subItemId}")
    public SubItem updateSubItem(@PathVariable Long subItemId, @RequestBody CreateSubItemDto dto) {
        return subItemService.updateSubItem(subItemId, dto);
    }

    // Delete SubItem
    @DeleteMapping("/subitems/{subItemId}")
    public String deleteSubItem(@PathVariable Long subItemId) {

        subItemService.deleteSubItem(subItemId);
        return "SubItem deleted successfully";
    }
}