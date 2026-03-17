package com.example.RA_Billing.ServicesImpl;

import com.example.RA_Billing.DTO.CreateSubItemDto;
import com.example.RA_Billing.Model.Project_Items;
import com.example.RA_Billing.Model.SubItem;
import com.example.RA_Billing.Repo.ItemRepository;
import com.example.RA_Billing.Repo.SubItemRepository;
import com.example.RA_Billing.Services.SubItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubItemServiceImpl implements SubItemService {

    private final SubItemRepository subItemRepository;
    private final ItemRepository itemRepository;

    public SubItem createSubItem(Long itemId, CreateSubItemDto dto) {

        Project_Items item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        SubItem subItem = SubItem.builder()
                .subItemNo(dto.getSubItemNo())
                .description(dto.getDescription())
                .unit(dto.getUnit())
                .rate(dto.getRate())
                .item(item)
                .build();

        return subItemRepository.save(subItem);
    }

    public List<SubItem> getSubItemsByItem(Long itemId) {

        return subItemRepository.findByItemId(itemId);
    }

    public SubItem getSubItem(Long subItemId) {

        return subItemRepository.findById(subItemId)
                .orElseThrow(() -> new RuntimeException("SubItem not found"));
    }

    public SubItem updateSubItem(Long subItemId, CreateSubItemDto dto) {

        SubItem subItem = getSubItem(subItemId);

        subItem.setSubItemNo(dto.getSubItemNo());
        subItem.setDescription(dto.getDescription());
        subItem.setUnit(dto.getUnit());
        subItem.setRate(dto.getRate());

        return subItemRepository.save(subItem);
    }

    public void deleteSubItem(Long subItemId) {

        subItemRepository.deleteById(subItemId);
    }
}