package Emproject.ems_backend.controller;

import Emproject.ems_backend.dto.EmployeeDto;
import Emproject.ems_backend.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;


    @MockBean
    private EmployeeService employeeService;

    @Test
    void testGetAllEmployees() throws Exception {
        when(employeeService.getAllEmployees()).thenReturn(Arrays.asList(
            new EmployeeDto(1L, "xxxx", "yyy", "zzz@example.com", "8888999998", "CCE", "Developer", LocalDate.now(), 50000.0)
        ));

        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstname").value("xxxx"));
    }
}
