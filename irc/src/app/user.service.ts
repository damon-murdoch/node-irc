import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
	providedIn: 'root'
})

export class UserService {
	
	constructor(private http:HttpClient) { }
	
	loginUser(user)
	{
		let body = JSON.stringify(user);
		return this.http.post('http://localhost/1337/api/login',body,httpOptions);
	}
	
	createUser(user)
	{
		let body = JSON.stringify(user);
		return this.http.post('http://localhost/1337/api/register/',body,httpOptions);
	}
	
	promoteSuperAdmin(user)
	{
		let body = JSON.stringify(user);
		return this.http.post('http://localhost/1337/api/superpromote',body,httpOptions);
	}
	
	demote SuperAdmin(user)
	{
		let body = JSON.stringify(user);
		return this.http.post('http://localhost/1337/api/superdemote',body,httpOptions);
	}
	
	promoteGroupAdmin(user)
	{
		let body = JSON.stringify(user);
		return this.http.post('http://localhost/1337/api/grouppromote',body,httpOptions);
	}
	
	demoteGroupAdmint(user)
	{
		let body = JSON.stringify(user);
		return this.http.post('http://localhost/1337/api/groupdemote',body,httpOptions);
	}
}
