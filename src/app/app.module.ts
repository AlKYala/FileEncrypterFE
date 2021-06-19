import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EncryptionComponent } from './encryption/encryption.component';
import {MDBBootstrapModule} from "angular-bootstrap-md";
import { NavbarComponent } from './navbar/navbar.component';
import { LandingComponent } from './landing/landing.component';
import {RouterModule} from "@angular/router";
@NgModule({
  declarations: [
    AppComponent,
    EncryptionComponent,
    NavbarComponent,
    LandingComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
