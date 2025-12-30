
# Employee Management System (EMS)

## Overview
The **Employee Management System (EMS)** is a full-stack web application designed for administrators to manage employee records. It provides functionalities to **add, edit, view, and delete employees**, along with API verification test cases.  

- **Frontend:** React (Vite)  
- **Backend:** Spring Boot (Java)  
- **Database:** MySQL (Aurora RDS)  

> **Note:** Currently, admin authentication is implemented in the frontend using hardcoded credentials.

---

## Table of Contents
1. [Features](#features)  
2. [Technology Stack](#technology-stack)  
3. [Architecture](#architecture)  
4. [Project Structure](#project-structure)  
5. [Installation](#installation)  
6. [Configuration](#configuration)  
7. [Running the Application](#running-the-application)  
8. [API Endpoints](#api-endpoints)  
9. [Testing](#testing)  
10. [Future Improvements](#future-improvements)  

---

## Features
- Admin login (hardcoded in frontend)  
- Employee CRUD operations:
  - Add new employee  
  - Edit existing employee  
  - Delete employee  
  - View employee details  
- Employee listing with search, sorting, and pagination  
- Notifications for CRUD operations  
- API test cases for backend verification  

---

## Technology Stack

| Layer       | Technology                          |
|------------|-------------------------------------|
| Frontend   | React (Vite), HTML, CSS, Bootstrap 5, Bootstrap Icons |
| Backend    | Java 22, Spring Boot, Spring Data JPA |
| Database   | MySQL (Aurora RDS)                  |
| Deployment | AWS Elastic Beanstalk               |
| Testing    | JUnit (Spring Boot Test Cases)      |

**Flow:**

1. User enters credentials on the React login page.
2. React verifies credentials against allowed users.
3. After login, React fetches employee data from Spring Boot APIs.
4. Spring Boot interacts with MySQL database for CRUD operations.
5. API responses are returned to frontend and displayed.

---

## Project Structure

### Frontend (React)

```
ems-frontend/
│
├─ src/
│   ├─ components/
│   │   └─ Login.jsx
│   ├─ App.jsx
│   ├─ index.jsx
│   └─ App.css
```

### Backend (Spring Boot)

```
ems-backend/
│
├─ src/main/java/EmpProject/ems_backend/
│   ├─ config/
│   │   └─ CorsConfig.java
│   ├─ controller/
│   │   └─ EmployeeController.java
│   ├─ dto/
│   │   └─ EmployeeDto.java
│   ├─ entity/
│   │   └─ Employee.java
│   ├─ exception/
│   │   ├─ ErrorDetails.java
│   │   ├─ GlobalExceptionHandler.java
│   │   └─ ResourceNotFoundException.java
│   ├─ mapper/
│   │   └─ EmployeeMapper.java
│   ├─ repository/
│   │   └─ EmployeeRepository.java
│   ├─ service/
│   │   └─ EmployeeService.java
│   └─ EmsBackendApplication.java
│
└─ tests/
    └─ EmsBackendApplicationTests.java
```

---

## Installation

### Backend

1. Clone the repository:

```bash
git clone <your-repo-url>
cd ems-backend
```

2. Configure MySQL (Aurora RDS) connection in `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://<your-db-endpoint>:3306/ems
spring.datasource.username=<username>
spring.datasource.password=<password>
```

3. Build and run the backend:

```bash
mvn clean install
mvn spring-boot:run
```

### Frontend

1. Navigate to the frontend folder:

```bash
cd ems-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run frontend:

```bash
npm run dev
```

---

## Configuration

**Admin users (hardcoded in `Login.jsx`):**

> Update these credentials or integrate proper authentication in the future.

---

## Running the Application

1. Start backend Spring Boot server.
2. Start frontend Vite server.
3. Open browser at `http://localhost:5173`.
4. Login using allowed credentials.
5. Access employee management features.

---

## API Endpoints

| Endpoint              | Method | Description           |
| --------------------- | ------ | --------------------- |
| `/api/employees`      | GET    | Get all employees     |
| `/api/employees/{id}` | GET    | Get employee by ID    |
| `/api/employees`      | POST   | Create a new employee |
| `/api/employees/{id}` | PUT    | Update employee       |
| `/api/employees/{id}` | DELETE | Delete employee       |

---

## Testing

* Test cases are located in `EmsBackendApplicationTests.java`.
* Run tests using:

```bash
mvn test
```

---

## Future Improvements

* Implement proper backend authentication (JWT / OAuth2)
* Role-based access control (Admin, HR, Employee)
* Upload employee photos
* Advanced search and filter options
* CI/CD for automatic deployments



<img width="1536" height="1024" alt="ems_architecture" src="https://github.com/user-attachments/assets/7ae72556-ae27-48f0-b229-432d29008f38" />

