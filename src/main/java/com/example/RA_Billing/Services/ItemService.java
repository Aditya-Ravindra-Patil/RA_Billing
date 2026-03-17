package com.example.RA_Billing.Services;

import com.example.RA_Billing.DTO.CreateItemDto;
import com.example.RA_Billing.Model.Project_Items;

import java.util.List;

public interface ItemService {
    Project_Items createProjectItems(Long stageId, CreateItemDto createProjectItemDto);

    List<Project_Items> getItemsByStage(Long stageId);

    Project_Items getItem(Long itemId);

    Project_Items updateItem(Long itemId, CreateItemDto dto);

    void deleteItem(Long itemId);

}
