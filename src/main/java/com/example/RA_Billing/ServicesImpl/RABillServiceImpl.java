package com.example.RA_Billing.ServicesImpl;

import com.example.RA_Billing.DTO.AbstractDto;
import com.example.RA_Billing.Model.Project_Items;
import com.example.RA_Billing.Model.RABill;
import com.example.RA_Billing.Model.Stage;
import com.example.RA_Billing.Model.SubItem;
import com.example.RA_Billing.Repo.*;
import com.example.RA_Billing.Services.RABillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RABillServiceImpl implements RABillService {

    private final StageRepository stageRepository;
    private final ItemRepository itemRepository;
    private final SubItemRepository subItemRepository;
    private final MeasurementRepository measurementRepository;
    private final RABillRepository raBillRepository;

    // Generate RA Bill
    public RABill generateBill(Long stageId) {

        Stage stage = stageRepository.findById(stageId)
                .orElseThrow(() -> new RuntimeException("Stage not found"));

        List<Project_Items> items = itemRepository.findByStageId(stageId);

        double stageTotal = 0;

        for(Project_Items item : items) {

            List<SubItem> subItems = subItemRepository.findByItemId(item.getId());

            double itemQty = 0;

            for(SubItem sub : subItems) {

                Double qty = measurementRepository.getSubItemQuantity(sub.getId());

                if(qty != null)
                    itemQty += qty;
            }

            double itemAmount = itemQty * item.getTenderRate();

            stageTotal += itemAmount;
        }

        RABill bill = RABill.builder()
                .stage(stage)
                .totalAmount(stageTotal)
                .build();

        return raBillRepository.save(bill);
    }

    // Get RA Bill
    public RABill getBill(Long billId){

        return raBillRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
    }

    // Get Project RA Bills
    public List<RABill> getProjectBills(Long projectId){

        return raBillRepository.findByStageProjectId(projectId);
    }

    // Abstract Calculation
    public List<AbstractDto> getAbstract(Long raBillId){

        RABill bill = getBill(raBillId);

        Stage stage = bill.getStage();

        List<Project_Items> items = itemRepository.findByStageId(stage.getId());

        List<AbstractDto> abstractList = new ArrayList<>();

        for(Project_Items item : items){

            List<SubItem> subItems = subItemRepository.findByItemId(item.getId());

            for(SubItem sub : subItems){

                Double qty = measurementRepository.getSubItemQuantity(sub.getId());

                if(qty == null) qty = 0.0;

                Double amount = qty * sub.getRate();

                abstractList.add(
                        new AbstractDto(
                                item.getItemNo(),
                                sub.getSubItemNo(),
                                qty,
                                sub.getRate(),
                                amount
                        )
                );
            }
        }

        return abstractList;
    }
}