package Emproject.ems_backend.repository;

import Emproject.ems_backend.Entity.Employee;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@DataJpaTest
class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Test
    void testSaveEmployee() {
        Employee emp = new Employee(1L, "xxxx", "yyy", "zzz@example.com", "8888999998", "CCE", "Developer", LocalDate.now(), 50000.0);
        Employee saved = employeeRepository.save(emp);

        assertNotNull(saved.getId());
        assertEquals("xxxx", saved.getFirstName());
    }
}
