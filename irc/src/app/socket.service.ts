import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() { }

  sendMessage(name,group,room,message)
  {
    console.log(group + ':' + room + ':' + message);
    console.log('sendMessage()');

    this.socket.emit('add-message',{'name': name, 'group':group, 'room':room, 'message':message});
  }

  getMessages(group,room)
  {
    console.log(group + ':' + room);
    console.log('getMessages()');

    this.socket = io(this.url);

    let observable = new Observable(observer =>
    {
      this.socket.on('message',data=>{
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
