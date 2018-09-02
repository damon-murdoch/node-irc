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
	
	errormsg:string;
	
	constructor(private _userService:UserService,private router: Router) { }

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
	
	ngOnInit(){
		this.hide=true;
	}
}

/*
<form (submit)="createUser(name,mail,pass)">
	<label text="Username"> Username </label>
	<input [(ngModel)]="crname" type="text" placeholder="Username" id="crname" name="crname">
	
	<label text="Email"> Email </label>
	<input [(ngModel)]="crmail" type="text" placeholder="Email Address" id="crmail" name="crmail">
	
	<label text="Password"> Password </label>
	<input [(ngModel)]="crpass" type="password" placeholder="Password" id="crpass" name="crpass">
		
	<button type="submit" id="submit">Register</button>
</form>

<form (submit) = "promoteUser(prname)" >
	<label text="Username"> Username </label>
	<input [(ngModel)]="prname" type="text" placeholder="Username" id="prname" name="prname">
	<button type="submit" id="submit">Register</button>
</form>

<form (submit) = "demoteUser(dmname)" >
	<label text="Username"> Username </label>
	<input [(ngModel)]="dmname" type="text" placeholder="Username" id="dmname" name="dmname">
	<button type="submit" id="submit">Register</button>
</form>
*/