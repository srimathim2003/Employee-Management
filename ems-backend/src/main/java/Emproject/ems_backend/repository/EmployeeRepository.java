package Emproject.ems_backend.repository;

import Emproject.ems_backend.Entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}

