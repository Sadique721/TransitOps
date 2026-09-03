package com.transitops.security;

import com.transitops.controller.ExpenseController;
import com.transitops.controller.MaintenanceController;
import com.transitops.controller.TripController;
import com.transitops.controller.VehicleController;
import com.transitops.service.ExpenseService;
import com.transitops.service.MaintenanceService;
import com.transitops.service.TripService;
import com.transitops.service.VehicleService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RbacSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VehicleService vehicleService;

    @MockBean
    private TripService tripService;

    @MockBean
    private MaintenanceService maintenanceService;

    @MockBean
    private ExpenseService expenseService;

    @Test
    @DisplayName("RBAC Gray-Box: ADMIN is authorized to retire vehicle")
    @WithMockUser(username = "admin@transitops.com", roles = {"ADMIN"})
    void testRetireVehicle_Admin_Allowed() throws Exception {
        mockMvc.perform(delete("/api/v1/vehicles/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("RBAC Gray-Box: DRIVER is forbidden (403) from retiring vehicle")
    @WithMockUser(username = "driver@transitops.com", roles = {"DRIVER"})
    void testRetireVehicle_Driver_Forbidden() throws Exception {
        mockMvc.perform(delete("/api/v1/vehicles/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("RBAC Gray-Box: FLEET_MANAGER is authorized to dispatch trip")
    @WithMockUser(username = "manager@transitops.com", roles = {"FLEET_MANAGER"})
    void testDispatchTrip_FleetManager_Allowed() throws Exception {
        mockMvc.perform(patch("/api/v1/trips/1/dispatch"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("RBAC Gray-Box: DRIVER is forbidden (403) from dispatching trip")
    @WithMockUser(username = "driver@transitops.com", roles = {"DRIVER"})
    void testDispatchTrip_Driver_Forbidden() throws Exception {
        mockMvc.perform(patch("/api/v1/trips/1/dispatch"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("RBAC Gray-Box: FINANCIAL_ANALYST is authorized to view expenses")
    @WithMockUser(username = "finance@transitops.com", roles = {"FINANCIAL_ANALYST"})
    void testGetExpenses_FinancialAnalyst_Allowed() throws Exception {
        mockMvc.perform(get("/api/v1/expenses"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("RBAC Gray-Box: DRIVER is forbidden (403) from viewing financial expenses")
    @WithMockUser(username = "driver@transitops.com", roles = {"DRIVER"})
    void testGetExpenses_Driver_Forbidden() throws Exception {
        mockMvc.perform(get("/api/v1/expenses"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("RBAC Gray-Box: SAFETY_OFFICER is authorized to view maintenance logs")
    @WithMockUser(username = "safety@transitops.com", roles = {"SAFETY_OFFICER"})
    void testGetMaintenance_SafetyOfficer_Allowed() throws Exception {
        mockMvc.perform(get("/api/v1/maintenance"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("RBAC Gray-Box: DRIVER is forbidden (403) from accessing maintenance batch endpoint")
    @WithMockUser(username = "driver@transitops.com", roles = {"DRIVER"})
    void testGetMaintenance_Driver_Forbidden() throws Exception {
        mockMvc.perform(get("/api/v1/maintenance"))
                .andExpect(status().isForbidden());
    }
}
