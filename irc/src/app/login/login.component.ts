import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { UserService } from '../user.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
	

	constructor(private _userService:UserService) {}

	ngOnInit() {}
	
	handleLogin(name,pass,data)
	{
		if(data.loggedIn)
		{
			this._userService.setLocalStorage(name,pass);
		}
		else
		{
			localStorage.clear();
		}
	}
	
	loginUser(name,pass)
	{
		let user =
		{
			name:name,
			pass:pass
		}

		this._userService.loginUser(user).subscribe(
			data => this.handleLogin(name,pass,data)
		);
	}	
}
