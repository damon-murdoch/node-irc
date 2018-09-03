import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { UserService } from '../user.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groupadmintoolbar',
  templateUrl: './groupadmintoolbar.component.html',
  styleUrls: ['./groupadmintoolbar.component.css']
})
export class GroupadmintoolbarComponent implements OnInit {

	hide:boolean;
	
	hidemsg:string;
	errormsg:string;

	constructor(private _userService:UserService, private _dataService:DataService, private router: Router) { }
	
	createUser(name,mail,pass,salt)
	{
		let user = 
		{
			name:name,
			mail:mail,
			pass:pass,
			salt:null
		};
		
		this._userService.createUser(user).subscribe(
			data => 
			{
				if(data["success"])
				{
					this.errormsg = "Successfully registered user!";
					console.log("Successfully registered user!");
				}
				else
				{
					this.errormsg = data["err"];
					console.log("Error: "+data["err"]);
				}
			}
		);
	}
	
	promoteGroupAdmin(name)
	{
		let data = 
		{
			name:name
		}
		this._userService.promoteGroupAdmin(data).subscribe(
			data =>
			{
				if(data["success"])
				{
					this.errormsg = "Successfully promoted user!";
					console.log("Successfully promoted user!");
				}
				else
				{
					this.errormsg = data["err"];
					console.log("Error: "+data["err"]);
				}
			}
		);
	}
	
	demoteGroupAdmin(name)
	{
		let data = 
		{
			name:name
		}
		this._userService.demoteGroupAdmin(data).subscribe(
			data =>
			{
				if(data["success"])
				{
					this.errormsg = "Successfully demoted user!";
					console.log("Successfully demoted user!");
				}
				else
				{
					this.errormsg = data["err"];
					console.log("Error: "+data["err"]);
				}
			}
		);
	}
	
	createGroup(group)
	{
		let data =
		{
			group:group
		}
		this._dataService.createGroup(data).subscribe(
			data => 
			{
				if(data["success"])
				{
					this.errormsg = "Successfully created group!";
				}
				else
				{
					this.errormsg = data["err"];
				}
			}
		);
	}
	
	deleteGroup(group)
	{
		let data =
		{
			group:group
		}
		this._dataService.deleteGroup(data).subscribe(
			data => 
			{
				if(data["success"])
				{
					this.errormsg = "Successfully deleted group!";
				}
				else
				{
					this.errormsg = data["err"];
				}
			}
		);
	}
	
	createRoom(group,room)
	{
		let data =
		{
			group:group,
			room:room
		}
		this._dataService.createRoom(data).subscribe(
			data => 
			{
				if(data["success"])
				{
					this.errormsg = "Successfully created room!";
				}
				else
				{
					this.errormsg = data["err"];
				}
			}
		);
	}
	
	deleteRoom(group,room)
	{
		let data =
		{
			group:group,
			room:room
		}
		this._dataService.deleteRoom(data).subscribe(
			data => 
			{
				if(data["success"])
				{
					this.errormsg = "Successfully deleted room!";
				}
				else
				{
					this.errormsg = data["err"];
				}
			}
		);
	}
	
	addUserToGroup(name,group)
	{
		let data = 
		{
			name:name,
			group:group
		}
		this._dataService.addUserToGroup(data).subscribe(
			data => 
			{
				console.log(name);
				console.log(group);
				console.log(data);
				
				if(data["success"])
				{
					console.log("Successfully added user!");
					this.errormsg = "Successfully added user!";
				}
				else
				{
					console.log(data["err"]);
					this.errormsg = data["err"];
				}
			}
		);
	}
	
	rmvUserFromGroup(name,group)
	{
		let data = 
		{
			name:name,
			group:group
		}
		this._dataService.rmvUserFromGroup(data).subscribe(
			data => 
			{
				if(data["success"])
				{
					console.log("Successfully removed user!");
					this.errormsg = "Successfully removed user!";
				}
				else
				{
					console.log(data["err"]);
					this.errormsg = data["err"];
				}
			}
		);
	}
	
	addUserToRoom(name,group,room)
	{
		let data = 
		{
			name:name,
			group:group,
			room:room
		}
		this._dataService.addUserToRoom(data).subscribe(
			data => 
			{
				if(data["success"])
				{
					this.errormsg = "Successfully added user to room!";
				}
				else
				{
					this.errormsg = data["err"];
				}
			}
		);
	}
	
	rmvUserFromRoom(name,group,room)
	{
		let data = 
		{
			name:name,
			group:group,
			room:room
		}
		this._dataService.rmvUserFromRoom(data).subscribe(
			data => 
			{
				if(data["success"])
				{
					this.errormsg = "Successfully removed user from room!";
				}
				else
				{
					this.errormsg = data["err"];
				}
			}
		);
	}
	
	hideToggle()
	{
		this.hide = !this.hide;
		this.hidemsg = "hide";
	}
	
	ngOnInit(){
		this.hide=true;
		this.hidemsg="unhide";
	}
}
