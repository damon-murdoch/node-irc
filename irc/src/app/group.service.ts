import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
	providedIn: 'root'
})

export class GroupService {
	
	constructor(private http:HttpClient) { }
	
	createGroup(group)
	{
		let body = JSON.stringify(group);
		return this.http.post('http://localhost/1337/api/creategroup',body,httpOptions);
	}
	
	DeleteGroup(group)
	{
		let body = JSON.stringify(group);
		return this.http.post('http://localhost/1337/api/deletegroup',body,httpOptions);
	}
}
