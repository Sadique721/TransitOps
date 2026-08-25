package com.transitops.service.workflow;

import com.transitops.entity.WorkflowTask;
import com.transitops.repository.WorkflowTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkflowEngineService {

    private final WorkflowTaskRepository workflowTaskRepository;

    public WorkflowTask createApprovalTask(String taskType, String description, String assignedToRole, String tenantId) {
        WorkflowTask task = WorkflowTask.builder()
                .taskType(taskType)
                .description(description)
                .status("PENDING")
                .assignedToRole(assignedToRole)
                .build();
        task.setTenantId(tenantId);
        return workflowTaskRepository.save(task);
    }

    public WorkflowTask approveTask(Long taskId) {
        WorkflowTask task = workflowTaskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));
        task.setStatus("APPROVED");
        return workflowTaskRepository.save(task);
    }

    public WorkflowTask rejectTask(Long taskId) {
        WorkflowTask task = workflowTaskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));
        task.setStatus("REJECTED");
        return workflowTaskRepository.save(task);
    }
}
