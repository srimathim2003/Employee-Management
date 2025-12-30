package Emproject.ems_backend.mapper;

import Emproject.ems_backend.Entity.Employee;
import Emproject.ems_backend.dto.EmployeeDto;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EmployeeMapperTest {

    @Test
    void testMapping() {
        Employee emp = new Employee(1L, "xxxx", "yyy", "zzz@example.com", "8888999998", "CCE", "Developer", LocalDate.now(), 50000.0);
        EmployeeDto dto = EmployeeMapper.mapToEmployeeDto(emp);

        assertEquals(emp.getFirstName(), dto.getFirstname());
        assertEquals(emp.getLastName(), dto.getLastname());
    }
}
