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
	
	rooms:string[];
	
	selectedroom:string;

	constructor(private _userService:UserService,  private _dataService:DataService, private router: Router) { }

	getGroupData(group)
	{
		let data = 
		{
			name:name,
			group:group
		}
		this._dataService.getGroupData(data).subscribe(
			data =>
			{
				
			}
		);
	}
	
	ngOnInit()
	{
		
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
