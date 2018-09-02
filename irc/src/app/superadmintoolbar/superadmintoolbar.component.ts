import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-superadmintoolbar',
  templateUrl: './superadmintoolbar.component.html',
  styleUrls: ['./superadmintoolbar.component.css']
})

export class SuperadmintoolbarComponent implements OnInit {
	
	hide:boolean;
	
	hidemsg:string;
	errormsg:string;
	
	constructor(private _userService:UserService,private router: Router) { }
	
	promoteUser(name)
	{
		let user = 
		{
			name:name
		}
		this._userService.promoteSuperAdmin(user).subscribe(
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
	
	demoteUser(name)
	{
		let user =
		{
			name:name
		}
		this._userService.demoteSuperAdmin(user).subscribe(
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
	
	deleteUser(name)
	{
		let user = 
		{
			name:name
		}
		this._userService.deleteUser(user).subscribe(
			data => 
			{
				if(data["success"])
				{
					this.errormsg = "Successfully deleted user!";
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