package Emproject.ems_backend.service;

import Emproject.ems_backend.Entity.Employee;
import Emproject.ems_backend.dto.EmployeeDto;
import Emproject.ems_backend.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    public EmployeeServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetEmployeeById() {
        Employee emp = new Employee(1L, "xxxx", "yyy", "zzz@example.com", "8888999998", "CCE", "Developer", LocalDate.now(), 50000.0);
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(emp));

        EmployeeDto dto = employeeService.getEmployeeById(1L);
        assertEquals("xxxx", dto.getFirstname());
    }
}
