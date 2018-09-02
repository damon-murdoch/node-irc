import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
