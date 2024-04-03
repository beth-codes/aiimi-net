import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  private baseUrl = 'http://localhost:5126/api/users/';

  constructor(private http: HttpClient) { }

  // Method to fetch existing user data
  getUsers(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  // Method to search for employees based on search query
  searchUsers(query: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}?search=${query}`);
  }

  // Method to add new user
  addUser(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, employee);
  }
}
