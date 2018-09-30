import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { DataService } from '../data.service';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router';

import {SuperadmintoolbarComponent} from '../superadmintoolbar/superadmintoolbar.component';
import {GroupadmintoolbarComponent} from '../groupadmintoolbar/groupadmintoolbar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

	name:string;
	rank:string;

	groups:string[];

	selectedgroup:string;

	selectedgroupbool:boolean;

	rooms:string[];

	selectedroom:string;

	selectedroombool:boolean;

	messages:[];
  message;
  connection;

	constructor(
    private _userService:UserService,
    private _dataService:DataService,
    private _socketService:SocketService,
    private router: Router
  ) { }

  sendMessage(group,room,message)
  {
    this._socketService.sendMessage(this.name,group,room,message);
  }

  ngOnDestroy()
  {
    if(this.connection)
      this.connection.unsubscribe();
  }

	getGroupData(group)
	{
		this.selectedgroup = group;
		this.selectedgroupbool = true;

		console.log("No functionality yet.");

		let data =
		{
			name:this.name,
			group:group
		}
		this._dataService.getGroupData(data).subscribe(
			data =>
			{
				this.rooms = data["rooms"];
			}
		);
	}

	getRoomData(room)
	{
		this.selectedroom = room;
		this.selectedroombool = true;
    this.messages = getRoomData(this.selectedGroup,this.selectedRoom)
    this.connection = this._socketService.getMessages().subscribe(message=>
    {
      if(message.group == this.selectedGroup && message.room == this.selectedRoom)
      {
        this.messages.push(message);
        this.message = "";
      }
    });
	}

	ngOnInit()
	{
		this.selectedgroupbool = false;
		this.selectedroombool = false;

		if (!localStorage.name || !localStorage.pass)
		{
			this.router.navigate(['/']);
		}

		let data =
		{
			name:localStorage["name"]
		};

		this._dataService.getData(data).subscribe(
			data =>
			{
				this.name = localStorage["name"];
				this.rank = data["rank"];
				this.groups = data["groups"];

        console.log(this.name + ":" + this.rank);

				console.log(this.groups);
			}
		);
	}

	logout()
	{
		localStorage.clear();
		this.router.navigate(['/']);
	}
}
