import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class DataService {

constructor(private http:HttpClient) { }

    addUserToGroup(data)
	{
		let body = JSON.stringify(data);
		return this.http.post('http://127.0.0.1:1337/api/groupadd',body,httpOptions);
	}

	rmvUserFromGroup(data)
	{
		let body = JSON.stringify(data);
		return this.http.post('http://127.0.0.1:1337/api/grouprmv',body,httpOptions);
	}

	addUserToRoom(data)
	{
		let body = JSON.stringify(data);
		return this.http.post('http://127.0.0.1:1337/api/rmadd',body,httpOptions);
	}

	rmvUserFromRoom(data)
	{
		let body = JSON.stringify(data);
		return this.http.post('http://127.0.0.1:1337/api/rmrmv',body,httpOptions);
	}

	getData(data)
	{
		let body = JSON.stringify(data);
		return this.http.post('http://127.0.0.1:1337/api/data',body,httpOptions);
	}

	getGroupData(data)
	{
	    let body = JSON.stringify(data);
		return this.http.post('http://127.0.0.1:1337/api/getgroup',body,httpOptions);
	}

	getRoomData(data)
	{
		console.log("No functionality yet.");
		let body = JSON.stringify(data);
		return this.http.post('http://127.0.0.1:1337/api/room',body,httpOptions);
	}

	createGroup(data)
	{
		let body = JSON.stringify(data);
		return this.http.post('http://127.0.0.1:1337/api/creategroup',body,httpOptions);
	}

	deleteGroup(data)
	{
		let body = JSON.stringify(data);
		return this.http.post('http://127.0.0.1:1337/api/deletegroup',body,httpOptions);
	}

	createRoom(data)
	{
		let body = JSON.stringify(data);
		return this.http.post('http://127.0.0.1:1337/api/createroom',body,httpOptions);
	}

	deleteRoom(data)
	{
		let body = JSON.stringify(data);
		return this.http.post('http://127.0.0.1:1337/api/deleteroom',body,httpOptions);
	}
}
