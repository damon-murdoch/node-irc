import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { DataService } from '../data.service';
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
	
	messages:string[];

	constructor(private _userService:UserService,  private _dataService:DataService, private router: Router) { }

	getGroupData(group)
	{
		this.selectedgroup = group;
		this.selectedgroupbool = true;
		
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
		
		let data = 
		{
			name:this.name,
			group:this.selectedgroup,
			room:room
		}
		this._dataService.getRoomData(data).subscribe(
			data =>
			{
				
				//this.messages = data;
			}
		);
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
