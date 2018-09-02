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
	
	setLocalStorage(name,pass)
	{
		localStorage.name = name;
		localStorage.pass = pass;
	}
	
	loginUser(user)
	{
		let body = JSON.stringify(user);
		console.log("Attempting to log in ..."+body);
		return this.http.post('http://127.0.0.1:1337/api/login',body,httpOptions);
	}
	
	createUser(user)
	{
		let body = JSON.stringify(user);
		console.log("Attempting to create ..."+body);
		return this.http.post('http://127.0.0.1:1337/api/register/',body,httpOptions);
	}
	
	promoteSuperAdmin(user)
	{
		let body = JSON.stringify(user);
		console.log("Attempting to super promote ..."+body);
		return this.http.post('http://127.0.0.1:1337/api/superpromote',body,httpOptions);
	}
	
	demoteSuperAdmin(user)
	{
		let body = JSON.stringify(user);
		console.log("Attempting to super demote ..."+body);
		return this.http.post('http://127.0.0.1:1337/api/superdemote',body,httpOptions);
	}
	
	promoteGroupAdmin(user)
	{
		let body = JSON.stringify(user);
		console.log("Attempting to group promote ..."+body);
		return this.http.post('http://127.0.0.1:1337/api/grouppromote',body,httpOptions);
	}
	
	demoteGroupAdmin(user)
	{
		let body = JSON.stringify(user);
		console.log("Attempting to group demote ..."+body);
		return this.http.post('http://127.0.0.1:1337/api/groupdemote',body,httpOptions);
	}
}
