import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { UserService } from '../user.service';
import { Router } from "@angular/router";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
	

	constructor(private _userService:UserService, private router: Router) {}

	ngOnInit() {}
	
	handleLogin(name,pass,data)
	{

	}
	
	loginUser(name,pass)
	{
		let user =
		{
			name:name,
			pass:pass
		}

		this._userService.loginUser(user).subscribe(
			data => 
			{
				if(data["loggedIn"])
				{
					this._userService.setLocalStorage(name,pass);
					this.router.navigate(['/dashboard']);
				}
				else
				{
					localStorage.clear();
				}
			}	
		);
	}	
}
