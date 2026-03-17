package com.example.RA_Billing.Controller;

import com.example.RA_Billing.DTO.CreateItemDto;
import com.example.RA_Billing.Model.Project_Items;
import com.example.RA_Billing.Services.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ItemController {

    @Autowired
    ItemService itemService;

    @PostMapping("/stages/{stageId}/items")
    public Project_Items createProjectItems(@PathVariable Long stageId, @RequestBody CreateItemDto createItemDto){
        return this.itemService.createProjectItems(stageId, createItemDto);
//        return null;
    }

    // Get Items of Stage
    @GetMapping("/stages/{stageId}/items")
    public List<Project_Items> getItemsByStage(
            @PathVariable Long stageId) {

        return itemService.getItemsByStage(stageId);
    }

    // Get Item
    @GetMapping("/items/{itemId}")
    public Project_Items getItem(
            @PathVariable Long itemId) {

        return itemService.getItem(itemId);
    }

    // Update Item
    @PutMapping("/items/{itemId}")
    public Project_Items updateItem(
            @PathVariable Long itemId,
            @RequestBody CreateItemDto dto) {

        return itemService.updateItem(itemId, dto);
    }

    // Delete Item
    @DeleteMapping("/items/{itemId}")
    public String deleteItem(
            @PathVariable Long itemId) {

        itemService.deleteItem(itemId);
        return "Item deleted successfully";
    }

}
