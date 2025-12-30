package Emproject.ems_backend.service;

import Emproject.ems_backend.Entity.Employee;
import Emproject.ems_backend.dto.EmployeeDto;
import Emproject.ems_backend.exception.ResourceNotFoundException;
import Emproject.ems_backend.mapper.EmployeeMapper;
import Emproject.ems_backend.repository.EmployeeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor

public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;

    @Override
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        Employee employee = EmployeeMapper.mapToEmployee(employeeDto);
        Employee createdEmployee = employeeRepository.save(employee);
        return EmployeeMapper.mapToEmployeeDto(createdEmployee);
    }

    @Override
    public EmployeeDto getEmployeeById(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));
        return EmployeeMapper.mapToEmployeeDto(employee);
    }

    @Override
    public java.util.List<EmployeeDto> getAllEmployees() {
        java.util.List<Employee> employees = employeeRepository.findAll();
        return employees.stream()
                .map(EmployeeMapper::mapToEmployeeDto)
                .toList();
    }

    @Override
    public EmployeeDto updateEmployee(Long employeeId, EmployeeDto employeeDto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));
        employee.setFirstName(employeeDto.getFirstname());
        employee.setLastName(employeeDto.getLastname());
        employee.setEmail(employeeDto.getEmail());
        employee.setPhone(employeeDto.getPhone());
        employee.setDepartment(employeeDto.getDepartment());
        employee.setPosition(employeeDto.getPosition());
        employee.setDateOfJoining(employeeDto.getDateOfJoining());
        employee.setSalary(employeeDto.getSalary());
        Employee updatedEmployee = employeeRepository.save(employee);
        return EmployeeMapper.mapToEmployeeDto(updatedEmployee);
    }

    @Override
    public void deleteEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));
        employeeRepository.delete(employee);
    }
}
