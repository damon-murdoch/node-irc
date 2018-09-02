import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class UserModule {
	name: string;
	mail: string;
	pass: string;
	salt: string;
}
