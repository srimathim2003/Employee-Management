package Emproject.ems_backend.mapper;

import Emproject.ems_backend.Entity.Employee;
import Emproject.ems_backend.dto.EmployeeDto;

public class EmployeeMapper {


    public static EmployeeDto mapToEmployeeDto(Employee employee) {
        return new EmployeeDto(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getPhone(),
                employee.getDepartment(),
                employee.getPosition(),
                employee.getDateOfJoining(),
                employee.getSalary()
        );
    }

public static Employee mapToEmployee(EmployeeDto employeeDto) {
    Employee employee = new Employee();
    employee.setFirstName(employeeDto.getFirstname());
    employee.setLastName(employeeDto.getLastname());
    employee.setEmail(employeeDto.getEmail());
    employee.setPhone(employeeDto.getPhone());
    employee.setDepartment(employeeDto.getDepartment());
    employee.setPosition(employeeDto.getPosition());
    employee.setDateOfJoining(employeeDto.getDateOfJoining());
    employee.setSalary(employeeDto.getSalary());
    return employee;
}

}

