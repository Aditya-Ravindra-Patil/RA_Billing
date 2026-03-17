package com.example.RA_Billing.ServicesImpl;

import com.example.RA_Billing.DTO.CreateItemDto;
import com.example.RA_Billing.Model.Project_Items;
import com.example.RA_Billing.Model.Stage;
import com.example.RA_Billing.Repo.ItemRepository;
import com.example.RA_Billing.Repo.StageRepository;
import com.example.RA_Billing.Services.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    ItemRepository itemRepository;
    @Autowired
    StageRepository stageRepository;


    @Override
    public Project_Items createProjectItems(Long stageId, CreateItemDto createProjectItemDto) {
        Stage stage = stageRepository.findById(stageId)
                .orElseThrow(() -> new RuntimeException("Stage not found"));
        return itemRepository.save(createProjectItemDto.building(stage));
    }

    public List<Project_Items> getItemsByStage(Long stageId) {

        return itemRepository.findByStageId(stageId);
    }

    public Project_Items getItem(Long itemId) {

        return itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    public Project_Items updateItem(Long itemId, CreateItemDto dto) {

        Project_Items item = getItem(itemId);

        item.setItemNo(dto.getItemNo());
        item.setDescription(dto.getDescription());
        item.setUnit(dto.getUnit());
        item.setTenderRate(dto.getTenderRate());

        return itemRepository.save(item);
    }

    public void deleteItem(Long itemId) {

        itemRepository.deleteById(itemId);
    }
}
