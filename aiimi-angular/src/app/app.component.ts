import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientService } from './http-client.service';
import { HttpClientModule } from '@angular/common/http';
import { Employee } from './employee';
import { AddEmployeeFormComponent } from './add-employee-form/add-employee-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    HttpClientModule, 
    CommonModule, 
    AddEmployeeFormComponent, 
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  selectedEmployees: Employee[] = [];
  searchQuery: string = '';
  showEmployees: boolean = false;
  selectedEmployee: Employee | null = null;
  showPopup: boolean = false;
  showAddForm: boolean = false;

  newEmployee: Employee = {
    id: Math.floor(Math.random() * 1000).toString(),
    firstName: '',
    lastName: '',
    jobTitle: '',
    phone: '',
    email: ''
  };

  constructor(private httpClientService: HttpClientService) { }
  ngOnInit(): void {
    this.fetchEmployees();
  }

  //fetch employee data
  fetchEmployees(): void {
    this.httpClientService.getUsers().subscribe(employees => {
      this.employees = employees;
    });
  }

  //only user if match is greater than 2
  searchEmployees(): void {
    if (this.searchQuery.trim().length < 2) {
      this.filteredEmployees = [];
      this.showEmployees = false;
      return;
    }

    // Search for the full name
    const query = this.searchQuery.toLowerCase();
    this.filteredEmployees = this.employees.filter(employee =>
      (employee.firstName.toLowerCase() + ' ' + employee.lastName.toLowerCase()).includes(query)
    );
    this.showEmployees = true;
  }


  toggleSelectEmployee(employee: Employee): void {
    const index = this.selectedEmployees.findIndex(emp => emp.id === employee.id);
    if (index === -1) {
      // If the employee is not already selected, add it to the array
      this.selectedEmployees.push(employee);
    }
  }

  isSelected(employee: Employee): boolean {
    // Check if the employee is selected
    return this.selectedEmployees.some(emp => emp.id === employee.id);
  }

  removeSelectedEmployee(employee: Employee): void {
    const index = this.selectedEmployees.findIndex(emp => emp.id === employee.id);
    if (index !== -1) {
      // Remove the employee from the selectedEmployees array
      this.selectedEmployees.splice(index, 1);
    }
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  submitForm(newEmployee: Employee): void {
    //convert phone to string so that data can be saved in the backend
    newEmployee.phone = newEmployee.phone.toString();

    // Call the addUser method in HttpClientService to send the form data to the backend
    this.httpClientService.addUser(newEmployee).subscribe({
      next: (response) => {
        this.showPopup = true;
      },
      error: (error) => {
        console.error('Error adding new employee:', error);
      }
    });

  }

  hidePopup(): void {
    // Hide the popup
    this.showPopup = false;
    this.newEmployee = {
      id: '',
      firstName: '',
      lastName: '',
      jobTitle: '',
      phone: '',
      email: ''
    };
  }

}

