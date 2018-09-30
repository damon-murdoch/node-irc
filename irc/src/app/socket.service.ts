import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable,of} from 'rxjs';
import * as io from 'socket.io-client';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = 'http://127.0.0.1:1337';
  private socket;

  constructor(private http:HttpClient) { }

  sendMessage(name,group,room,message)
  {
    //console.log(name + ":" + group + ':' + room + ':' + message);
	this.socket = io(this.url);
	
    console.log('sendMessage()');

    const body =
    {
      'name': name,
      'group':group,
      'room':room,
      'msg':message
    };

    console.log(body);

    const post =  this.http.post('http://127.0.0.1:1337/api/msg',JSON.stringify(body),httpOptions);

    this.socket.emit('add-message',body);

    console.log('Sent message!');

    return post;
}

  getMessages(group,room)
  {
    console.log(group + ':' + room);
    console.log('getMessages()');

    this.socket = io(this.url);

    let observable = new Observable(observer =>
    {
      this.socket.on('message',(data)=>{
        console.log("new message")
        observer.next(data);
      })
      return () =>
      {
        this.socket.disconnect();
      }
    });

    return observable;
  }
}
