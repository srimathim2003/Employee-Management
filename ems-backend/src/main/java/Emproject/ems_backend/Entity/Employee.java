package Emproject.ems_backend.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name="employees")

public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "email",nullable = false ,unique = true)
    private String email;
    @Column(name = "phone")
    private String phone;
    @Column(name = "department")
    private String department;
    @Column(name = "position")
    private String position;
    @Column(name = "date_of_joining")
    private LocalDate dateOfJoining;
    @Column(name = "salary")
    private Double salary;
}
