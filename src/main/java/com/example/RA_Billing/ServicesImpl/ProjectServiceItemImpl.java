package com.example.RA_Billing.ServicesImpl;

import com.example.RA_Billing.Model.Project_Items;
import com.example.RA_Billing.Repo.ProjectItemRepository;
import com.example.RA_Billing.Services.ProjectServiceItem;
import org.springframework.beans.factory.annotation.Autowired;

public class ProjectServiceItemImpl implements ProjectServiceItem {

    @Autowired
    ProjectItemRepository projectItemRepository;

    @Override
    public Project_Items createProjectItems(Project_Items projectItems) {
        return projectItemRepository.save(projectItems);
    }
}
