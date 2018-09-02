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
	
	errormsg:string;

	constructor(private _userService:UserService, private _dataService:DataService, private router: Router) { }
	
	ngOnInit(){
		this.hide=true;
	}
}
