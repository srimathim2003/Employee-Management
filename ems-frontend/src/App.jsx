import { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import Login from "./components/Login";

const BASE_URL = "http://employeeManagement.us-east-1.elasticbeanstalk.com/api/employees";
// USERS
const ALLOWED_USERS = [
  { email: "admin@gmail.com", password: "admin123" },
  { email: "sruthi@gmail.com", password: "sruthi123" }
];

// Screen constants
const SCREENS = {
  LOGIN: "login",
  EMPLOYEE_LIST: "employee_list",
  ADD_EMPLOYEE: "add_employee",
  EDIT_EMPLOYEE: "edit_employee",
  EMPLOYEE_DETAILS: "employee_details",
};

function App() {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState(SCREENS.LOGIN);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Employee data
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Form state
  const [form, setForm] = useState({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    dateOfJoining: "",
    salary: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // UI state
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ visible: false, id: null, name: "" });
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Employee List state
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Login state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 2800);
  };

  // Load employees
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new Error(`Failed to fetch employees: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setEmployees(data || []);
    } catch (error) {
      console.error("Load employees error:", error);
      // Check if it's a network error (backend not running)
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.name === "TypeError") {
        showNotification("Cannot connect to server. Please ensure the backend is running on http://localhost:8080", "error");
      } else {
        showNotification(error.message || "Unable to load employees. Please retry.", "error");
      }
      // For demo purposes, use mock data if API fails
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadEmployees();
    }
  }, [isLoggedIn]);

  // Login handler (optional - can skip)
const handleLogin = (e) => {
  e.preventDefault();

  const { email, password } = loginForm;

  if (!email || !password) {
    showNotification("Email and password required", "error");
    return;
  }

  // Check if email exists in hardcoded user list
  const user = ALLOWED_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    showNotification("Invalid email or password", "error");
    return;
  }

  // Success
  setIsLoggedIn(true);
  setCurrentScreen(SCREENS.EMPLOYEE_LIST);
  showNotification("Login successful!", "success");

  // Reset form
  setLoginForm({ email: "", password: "" });
};

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  // Form validation
  const validate = () => {
    const errs = {};
    if (!form.firstname.trim()) errs.firstname = "First name is required";
    if (!form.lastname.trim()) errs.lastname = "Last name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email format";
    if (form.salary && parseFloat(form.salary) <= 0) errs.salary = "Salary must be greater than 0";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // Navigation handlers
  const navigateToAddEmployee = () => {
    setForm({
      id: "",
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      dateOfJoining: "",
      salary: "",
    });
    setErrors({});
    setCurrentScreen(SCREENS.ADD_EMPLOYEE);
  };

  const navigateToEditEmployee = (emp) => {
    setForm({
      id: emp.id || "",
      firstname: emp.firstname || "",
      lastname: emp.lastname || "",
      email: emp.email || "",
      phone: emp.phone || "",
      department: emp.department || "",
      position: emp.position || "",
      dateOfJoining: emp.dateOfJoining || "",
      salary: emp.salary || "",
    });
    setErrors({});
    setCurrentScreen(SCREENS.EDIT_EMPLOYEE);
  };

  const navigateToEmployeeDetails = (emp) => {
    setSelectedEmployee(emp);
    setCurrentScreen(SCREENS.EMPLOYEE_DETAILS);
  };

  const navigateToEmployeeList = () => {
    setCurrentScreen(SCREENS.EMPLOYEE_LIST);
    setSelectedEmployee(null);
  };

  // CRUD operations
  const createEmployee = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      // Prepare data: convert empty strings to null for optional fields
      const employeeData = {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        department: form.department.trim() || null,
        position: form.position.trim() || null,
        dateOfJoining: form.dateOfJoining || null,
        salary: form.salary ? parseFloat(form.salary) : null,
      };
      
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to create employee: ${res.status} ${res.statusText}`);
      }
      
      showNotification("Employee created successfully.", "success");
      await loadEmployees();
      navigateToEmployeeList();
    } catch (error) {
      console.error("Create employee error:", error);
      // Check if it's a network error (backend not running)
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.name === "TypeError") {
        showNotification("Cannot connect to server. Please ensure the backend is running on http://localhost:8080", "error");
      } else {
        showNotification(error.message || "Create failed. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      // Prepare data: convert empty strings to null for optional fields
      const employeeData = {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        department: form.department.trim() || null,
        position: form.position.trim() || null,
        dateOfJoining: form.dateOfJoining || null,
        salary: form.salary ? parseFloat(form.salary) : null,
      };
      
      const res = await fetch(`${BASE_URL}/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to update employee: ${res.status} ${res.statusText}`);
      }
      
      showNotification("Employee updated successfully.", "success");
      await loadEmployees();
      navigateToEmployeeList();
    } catch (error) {
      console.error("Update employee error:", error);
      // Check if it's a network error (backend not running)
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.name === "TypeError") {
        showNotification("Cannot connect to server. Please ensure the backend is running on http://localhost:8080", "error");
      } else {
        showNotification(error.message || "Update failed. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirm = (id, firstname, lastname) => {
    setDeleteConfirm({ visible: true, id, name: `${firstname} ${lastname}` });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ visible: false, id: null, name: "" });
  };

  const deleteEmployee = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/${deleteConfirm.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete employee: ${res.status} ${res.statusText}`);
      showNotification("Employee deleted successfully.", "success");
      await loadEmployees();
      closeDeleteConfirm();
      if (currentScreen === SCREENS.EMPLOYEE_DETAILS) {
        navigateToEmployeeList();
      }
    } catch (error) {
      console.error("Delete employee error:", error);
      // Check if it's a network error (backend not running)
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.name === "TypeError") {
        showNotification("Cannot connect to server. Please ensure the backend is running on http://localhost:8080", "error");
      } else {
        showNotification(error.message || "Delete failed. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filtered and sorted employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees;

    // Search filter
    const term = search.trim().toLowerCase();
    if (term) {
      filtered = employees.filter(
        (emp) =>
          emp.firstname?.toLowerCase().includes(term) ||
          emp.lastname?.toLowerCase().includes(term) ||
          emp.email?.toLowerCase().includes(term) ||
          `${emp.id}`.includes(term)
      );
    }

    // Sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle null/undefined
        if (aVal == null) aVal = "";
        if (bVal == null) bVal = "";

        // Handle numeric values
        if (sortConfig.key === "id" || sortConfig.key === "salary") {
          aVal = parseFloat(aVal) || 0;
          bVal = parseFloat(bVal) || 0;
        } else {
          // String comparison
          aVal = String(aVal).toLowerCase();
          bVal = String(bVal).toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [employees, search, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredAndSortedEmployees.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  const renderLoginScreen = () => (
  <Login
    onLogin={() => {
      setIsLoggedIn(true);
      setCurrentScreen(SCREENS.EMPLOYEE_LIST);
      showNotification("Login successful!", "success");
    }}
    loading={loading}
  />
);

  // Render Employee List Screen
  const renderEmployeeListScreen = () => (
    <div className="app">
      <nav className="navbar navbar-expand-lg shadow-lg">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">
            <i className="bi bi-building me-2"></i>Employee Management System
          </a>
          <div className="navbar-text text-white-50 d-none d-md-flex align-items-center">
            <i className="bi bi-calendar3 me-2"></i>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </nav>

      <div className="content-shell">
        <header className="hero">
          <div>
            <p className="eyebrow">People Operations</p>
            <h1>Employee Directory</h1>
            <p className="subtitle">Manage your team members efficiently</p>
          </div>
          <div className="hero-metric">
            <div className="metric-value">{loading ? "…" : employees.length}</div>
            <div className="metric-label">Total Employees</div>
          </div>
        </header>

        <main className="page-content">
          <div className="card shadow-lg table-card">
            <div className="card-header d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <h5 className="mb-0">
                <i className="bi bi-table me-2"></i>Employee List
              </h5>
              <div className="d-flex gap-2 w-100 w-md-auto">
                <div className="search-box">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <button className="btn btn-primary" onClick={navigateToAddEmployee}>
                  <i className="bi bi-plus-circle me-2"></i>Add Employee
                </button>
              </div>
            </div>
            <div className="card-body">
              {loading && employees.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading employees...</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th
                            className="sortable"
                            onClick={() => handleSort("id")}
                            style={{ cursor: "pointer" }}
                          >
                            ID
                            {sortConfig.key === "id" && (
                              <i className={`bi bi-arrow-${sortConfig.direction === "asc" ? "up" : "down"} ms-2`}></i>
                            )}
                          </th>
                          <th
                            className="sortable"
                            onClick={() => handleSort("firstname")}
                            style={{ cursor: "pointer" }}
                          >
                            Name
                            {sortConfig.key === "firstname" && (
                              <i className={`bi bi-arrow-${sortConfig.direction === "asc" ? "up" : "down"} ms-2`}></i>
                            )}
                          </th>
                          <th
                            className="sortable"
                            onClick={() => handleSort("email")}
                            style={{ cursor: "pointer" }}
                          >
                            Email
                            {sortConfig.key === "email" && (
                              <i className={`bi bi-arrow-${sortConfig.direction === "asc" ? "up" : "down"} ms-2`}></i>
                            )}
                          </th>
                          <th
                            className="sortable"
                            onClick={() => handleSort("department")}
                            style={{ cursor: "pointer" }}
                          >
                            Department
                            {sortConfig.key === "department" && (
                              <i className={`bi bi-arrow-${sortConfig.direction === "asc" ? "up" : "down"} ms-2`}></i>
                            )}
                          </th>
                          <th
                            className="sortable"
                            onClick={() => handleSort("position")}
                            style={{ cursor: "pointer" }}
                          >
                            Position
                            {sortConfig.key === "position" && (
                              <i className={`bi bi-arrow-${sortConfig.direction === "asc" ? "up" : "down"} ms-2`}></i>
                            )}
                          </th>
                          <th
                            className="sortable"
                            onClick={() => handleSort("dateOfJoining")}
                            style={{ cursor: "pointer" }}
                          >
                            DOJ
                            {sortConfig.key === "dateOfJoining" && (
                              <i className={`bi bi-arrow-${sortConfig.direction === "asc" ? "up" : "down"} ms-2`}></i>
                            )}
                          </th>
                          <th
                            className="sortable"
                            onClick={() => handleSort("salary")}
                            style={{ cursor: "pointer" }}
                          >
                            Salary
                            {sortConfig.key === "salary" && (
                              <i className={`bi bi-arrow-${sortConfig.direction === "asc" ? "up" : "down"} ms-2`}></i>
                            )}
                          </th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedEmployees.length > 0 ? (
                          paginatedEmployees.map((emp) => (
                            <tr key={emp.id}>
                              <td>
                                <span className="badge bg-secondary">#{emp.id}</span>
                              </td>
                              <td className="fw-semibold">
                                {emp.firstname} {emp.lastname}
                              </td>
                              <td>
                                <a className="email-link" href={`mailto:${emp.email}`}>
                                  {emp.email}
                                </a>
                              </td>
                              <td>{emp.department || "-"}</td>
                              <td>{emp.position || "-"}</td>
                              <td>{emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString() : "-"}</td>
                              <td>{emp.salary ? `$${parseFloat(emp.salary).toLocaleString()}` : "-"}</td>
                              <td>
                                <div className="d-flex justify-content-center gap-2">
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => navigateToEmployeeDetails(emp)}
                                    title="View employee"
                                  >
                                    <i className="bi bi-eye-fill"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-edit"
                                    onClick={() => navigateToEditEmployee(emp)}
                                    title="Edit employee"
                                  >
                                    <i className="bi bi-pencil-fill"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-delete"
                                    onClick={() => openDeleteConfirm(emp.id, emp.firstname, emp.lastname)}
                                    title="Delete employee"
                                  >
                                    <i className="bi bi-trash-fill"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center py-5">
                              <i className="bi bi-inbox display-5 text-muted d-block mb-3"></i>
                              <p className="text-muted mb-0">
                                No employees found. Use "Add Employee" to add the first record.
                              </p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="pagination-container">
                      <div className="pagination-info">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedEmployees.length)} of{" "}
                        {filteredAndSortedEmployees.length} employees
                      </div>
                      <div className="pagination-controls">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <i className="bi bi-chevron-left"></i> Previous
                        </button>
                        <span className="pagination-page-info">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next <i className="bi bi-chevron-right"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  // Render Add/Edit Employee Form
  const renderEmployeeForm = () => {
    const isEdit = currentScreen === SCREENS.EDIT_EMPLOYEE;
    return (
      <div className="app">
        <nav className="navbar navbar-expand-lg shadow-lg">
          <div className="container-fluid">
            <a className="navbar-brand fw-bold" href="#" onClick={navigateToEmployeeList} style={{ cursor: "pointer" }}>
              <i className="bi bi-building me-2"></i>Employee Management System
            </a>
          </div>
        </nav>

        <div className="content-shell">
          <div className="form-container">
            <div className="form-card">
              <div className="form-header">
                <h2>
                  <i className={`bi ${isEdit ? "bi-pencil-fill" : "bi-person-plus-fill"} me-2`}></i>
                  {isEdit ? "Edit Employee" : "Add Employee"}
                </h2>
                <button className="btn btn-link text-muted" onClick={navigateToEmployeeList}>
                  <i className="bi bi-arrow-left me-2"></i>Back to List
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (isEdit) updateEmployee();
                  else createEmployee();
                }}
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        className={`form-control ${errors.firstname ? "is-invalid" : ""}`}
                        placeholder="e.g., Meena"
                        value={form.firstname}
                        onChange={handleFormChange}
                      />
                      {errors.firstname && <div className="invalid-feedback">{errors.firstname}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        className={`form-control ${errors.lastname ? "is-invalid" : ""}`}
                        placeholder="e.g., R"
                        value={form.lastname}
                        onChange={handleFormChange}
                      />
                      {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="meena@example.com"
                    value={form.email}
                    onChange={handleFormChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="+1 234 567 8900"
                    value={form.phone}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        name="department"
                        className="form-control"
                        placeholder="e.g., HR, Engineering"
                        value={form.department}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Position</label>
                      <input
                        type="text"
                        name="position"
                        className="form-control"
                        placeholder="e.g., Manager, Developer"
                        value={form.position}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Date of Joining</label>
                      <input
                        type="date"
                        name="dateOfJoining"
                        className="form-control"
                        value={form.dateOfJoining}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Salary</label>
                      <input
                        type="number"
                        name="salary"
                        className={`form-control ${errors.salary ? "is-invalid" : ""}`}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={form.salary}
                        onChange={handleFormChange}
                      />
                      {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-cancel" onClick={navigateToEmployeeList} disabled={loading}>
                    <i className="bi bi-x-circle me-2"></i>Cancel
                  </button>
                  <button type="submit" className="btn btn-submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {isEdit ? "Saving..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <i className={`bi ${isEdit ? "bi-save" : "bi-check-circle"} me-2`}></i>
                        {isEdit ? "Save Changes" : "Save"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Employee Details Screen
  const renderEmployeeDetailsScreen = () => {
    if (!selectedEmployee) {
      navigateToEmployeeList();
      return null;
    }

    const emp = selectedEmployee;
    return (
      <div className="app">
        <nav className="navbar navbar-expand-lg shadow-lg">
          <div className="container-fluid">
            <a className="navbar-brand fw-bold" href="#" onClick={navigateToEmployeeList} style={{ cursor: "pointer" }}>
              <i className="bi bi-building me-2"></i>Employee Management System
            </a>
          </div>
        </nav>

        <div className="content-shell">
          <div className="details-container">
            <div className="details-card">
              <div className="details-header">
                <div>
                  <button className="btn btn-link text-muted mb-2" onClick={navigateToEmployeeList}>
                    <i className="bi bi-arrow-left me-2"></i>Back to List
                  </button>
                  <h2>
                    <i className="bi bi-person-fill me-2"></i>Employee Details
                  </h2>
                </div>
                <div className="details-actions">
                  <button className="btn btn-edit" onClick={() => navigateToEditEmployee(emp)}>
                    <i className="bi bi-pencil-fill me-2"></i>Edit
                  </button>
                  <button className="btn btn-delete" onClick={() => openDeleteConfirm(emp.id, emp.firstname, emp.lastname)}>
                    <i className="bi bi-trash-fill me-2"></i>Delete
                  </button>
                </div>
              </div>

              <div className="details-body">
                <div className="details-grid">
                  <div className="detail-item">
                    <label>ID</label>
                    <div className="detail-value">
                      <span className="badge bg-secondary">#{emp.id}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>First Name</label>
                    <div className="detail-value">{emp.firstname || "-"}</div>
                  </div>
                  <div className="detail-item">
                    <label>Last Name</label>
                    <div className="detail-value">{emp.lastname || "-"}</div>
                  </div>
                  <div className="detail-item">
                    <label>Full Name</label>
                    <div className="detail-value fw-bold">
                      {emp.firstname} {emp.lastname}
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <div className="detail-value">
                      <a className="email-link" href={`mailto:${emp.email}`}>
                        {emp.email || "-"}
                      </a>
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <div className="detail-value">{emp.phone || "-"}</div>
                  </div>
                  <div className="detail-item">
                    <label>Department</label>
                    <div className="detail-value">{emp.department || "-"}</div>
                  </div>
                  <div className="detail-item">
                    <label>Position</label>
                    <div className="detail-value">{emp.position || "-"}</div>
                  </div>
                  <div className="detail-item">
                    <label>Date of Joining</label>
                    <div className="detail-value">
                      {emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : "-"}
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Salary</label>
                    <div className="detail-value fw-bold text-success">
                      {emp.salary ? `$${parseFloat(emp.salary).toLocaleString()}` : "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <>
      {notification.show && (
        <div className={`toast-notification ${notification.type}`}>
          <i
            className={`bi ${
              notification.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"
            } me-2`}
          ></i>
          {notification.message}
        </div>
      )}

      {currentScreen === SCREENS.LOGIN && renderLoginScreen()}
      {currentScreen === SCREENS.EMPLOYEE_LIST && renderEmployeeListScreen()}
      {currentScreen === SCREENS.ADD_EMPLOYEE && renderEmployeeForm()}
      {currentScreen === SCREENS.EDIT_EMPLOYEE && renderEmployeeForm()}
      {currentScreen === SCREENS.EMPLOYEE_DETAILS && renderEmployeeDetailsScreen()}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.visible && (
        <div className="modal-overlay" onClick={closeDeleteConfirm}>
          <div className="modal-dialog modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-danger">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>Confirm Delete
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeDeleteConfirm}></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
                <p className="text-muted mb-0 small">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-cancel" onClick={closeDeleteConfirm} disabled={loading}>
                  No
                </button>
                <button className="btn btn-danger" onClick={deleteEmployee} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>Deleting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash-fill me-2"></i>Yes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
