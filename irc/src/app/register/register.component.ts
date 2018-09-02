import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

	constructor(private _userService:UserService) {}

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
			data => console.log(data),
			err => console.log(err),
			() => console.log('Created user')
		);
	}
	
}
