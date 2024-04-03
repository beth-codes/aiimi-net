import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Employee } from '../employee';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-employee-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-employee-form.component.html',
  styleUrls: ['./add-employee-form.component.scss']
})

export class AddEmployeeFormComponent {
  inputField: boolean = false;

  @Output() formSubmitted = new EventEmitter<Employee>();
  constructor() {}
  newEmployee: Employee = {
    id: Math.floor(Math.random() * 1000).toString(),
    firstName: '',
    lastName: '',
    jobTitle: '',
    phone: '',
    email: ''
  };

  submitForm(): void {
    this.formSubmitted.emit(this.newEmployee);
    this.resetForm();
    this.inputField = true;
  }
 
  resetForm(): void {
    // Reset form fields to initial state
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