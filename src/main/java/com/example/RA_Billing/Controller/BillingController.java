package com.example.RA_Billing.Controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api")

@RestController
public class BillingController {

    @PostMapping("/billing")
    public void billing(){


    }
}
