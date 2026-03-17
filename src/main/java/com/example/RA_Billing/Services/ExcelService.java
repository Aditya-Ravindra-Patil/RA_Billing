package com.example.RA_Billing.Services;

import java.io.ByteArrayInputStream;

public interface ExcelService {
    ByteArrayInputStream generateExcel(Long raBillId);
}
