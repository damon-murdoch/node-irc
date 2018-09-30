import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';

import {HttpClientModule } from '@angular/common/http';
import { SuperadmintoolbarComponent } from './superadmintoolbar/superadmintoolbar.component';
import { GroupadmintoolbarComponent } from './groupadmintoolbar/groupadmintoolbar.component';
import { GroupmenuComponent } from './groupmenu/groupmenu.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    SuperadmintoolbarComponent,
    GroupadmintoolbarComponent,
    GroupmenuComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	HttpClientModule,
	FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
