package Emproject.ems_backend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor


public class EmployeeDto {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String phone;
    private String department;
    private String position;
    private LocalDate dateOfJoining;
    private Double salary;
}
