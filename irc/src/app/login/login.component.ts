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

	loginUser(name,pass)
	{
		let user =
		{
			name:name,
			pass:pass
		}
		
		this._userService.loginUser(user).subscribe(
			data => console.log(data),
			err => console.log(err),
			() => console.log('Logged in user')
		);
	}
}
