import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

	errormsg:string;

	constructor(private _userService:UserService, private router: Router) {}

	ngOnInit() {
		
	}
	
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
					console.log("Successfully registered user!");
					this.router.navigate(['/']);
				}
				else
				{
					this.errormsg = data["err"];
					console.log("Error: "+data["err"]);
				}
			}
		);
	}
	
}
