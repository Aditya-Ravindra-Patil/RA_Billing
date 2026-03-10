package com.example.RA_Billing.Controller;

import com.example.RA_Billing.Model.Project_Items;
import com.example.RA_Billing.Services.ProjectService;
import com.example.RA_Billing.Services.ProjectServiceItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProjectItemController {

    @Autowired
    ProjectServiceItem projectServiceItem;

    @PostMapping("/project_item")
    public Project_Items createProjectItems(@RequestBody Project_Items projectItems){
        this.projectServiceItem.createProjectItems(projectItems);
    }

}
