package com.example.RA_Billing.ServicesImpl;

import com.example.RA_Billing.Model.*;
import com.example.RA_Billing.Repo.*;
import com.example.RA_Billing.Services.ExcelService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelServiceImpl implements ExcelService {

    private final RABillRepository raBillRepository;
    private final ItemRepository itemRepository;
    private final SubItemRepository subItemRepository;
    private final MeasurementRepository measurementRepository;

    public ByteArrayInputStream generateExcel(Long raBillId) {

        RABill bill = raBillRepository.findById(raBillId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        Stage stage = bill.getStage();

        Workbook workbook = new XSSFWorkbook();

        Sheet measurementSheet = workbook.createSheet("Measurement Sheet");
        Sheet boqSheet = workbook.createSheet("BOQ");
        Sheet abstractSheet = workbook.createSheet("Abstract");
        Sheet raBillSheet = workbook.createSheet("RA Bill");

        createMeasurementSheet(measurementSheet, stage);
        createBOQSheet(boqSheet, stage);
        createAbstractSheet(abstractSheet, stage);
        createRABillSheet(raBillSheet, bill);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            workbook.write(out);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        try {
            workbook.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void createMeasurementSheet(Sheet sheet, Stage stage) {

        Row header = sheet.createRow(0);

        header.createCell(0).setCellValue("SubItem");
        header.createCell(1).setCellValue("Length");
        header.createCell(2).setCellValue("Breadth");
        header.createCell(3).setCellValue("Depth");
        header.createCell(4).setCellValue("Volume");

        List<Project_Items> items = itemRepository.findByStageId(stage.getId());

        int rowIdx = 1;

        for(Project_Items item : items){

            List<SubItem> subs = subItemRepository.findByItemId(item.getId());

            for(SubItem sub : subs){

                List<MeasurementBookLog> logs =
                        measurementRepository.findBySubItemId(sub.getId());

                for(MeasurementBookLog m : logs){

                    Row row = sheet.createRow(rowIdx++);

                    row.createCell(0).setCellValue(sub.getSubItemNo());
                    row.createCell(1).setCellValue(m.getLength());
                    row.createCell(2).setCellValue(m.getBreadth());
                    row.createCell(3).setCellValue(m.getDepth());
                    row.createCell(4).setCellValue(m.getVolume());
                }
            }
        }
    }

    private void createBOQSheet(Sheet sheet, Stage stage){

        Row header = sheet.createRow(0);

        header.createCell(0).setCellValue("Item No");
        header.createCell(1).setCellValue("Description");
        header.createCell(2).setCellValue("Rate");

        List<Project_Items> items = itemRepository.findByStageId(stage.getId());

        int rowIdx = 1;

        for(Project_Items item : items){

            Row row = sheet.createRow(rowIdx++);

            row.createCell(0).setCellValue(item.getItemNo());
            row.createCell(1).setCellValue(item.getDescription());
            row.createCell(2).setCellValue(item.getTenderRate());
        }
    }

    private void createAbstractSheet(Sheet sheet, Stage stage){

        Row header = sheet.createRow(0);

        header.createCell(0).setCellValue("Item");
        header.createCell(1).setCellValue("SubItem");
        header.createCell(2).setCellValue("Quantity");
        header.createCell(3).setCellValue("Rate");
        header.createCell(4).setCellValue("Amount");

        List<Project_Items> items = itemRepository.findByStageId(stage.getId());

        int rowIdx = 1;

        for(Project_Items item : items){

            List<SubItem> subs = subItemRepository.findByItemId(item.getId());

            for(SubItem sub : subs){

                Double qty =
                        measurementRepository.getSubItemQuantity(sub.getId());

                if(qty == null) qty = 0.0;

                double amount = qty * sub.getRate();

                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(item.getItemNo());
                row.createCell(1).setCellValue(sub.getSubItemNo());
                row.createCell(2).setCellValue(qty);
                row.createCell(3).setCellValue(sub.getRate());
                row.createCell(4).setCellValue(amount);
            }
        }
    }

    private void createRABillSheet(Sheet sheet, RABill bill){

        Row row = sheet.createRow(0);

        row.createCell(0).setCellValue("RA Bill ID");
        row.createCell(1).setCellValue(bill.getId());

        Row totalRow = sheet.createRow(2);

        totalRow.createCell(0).setCellValue("Total Amount");
        totalRow.createCell(1).setCellValue(bill.getTotalAmount());
    }
}