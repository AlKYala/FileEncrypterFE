import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EncryptionComponent } from './encryption/encryption.component';
import {MDBBootstrapModule} from "angular-bootstrap-md";
import { NavbarComponent } from './navbar/navbar.component';
import { LandingComponent } from './landing/landing.component';
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app.routing-module";
import { UploadComponentComponent } from './upload-component/upload-component.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FileUploadModule} from "@iplab/ngx-file-upload";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { DecryptionComponent } from './decryption/decryption.component';
@NgModule({
  declarations: [
    AppComponent,
    EncryptionComponent,
    NavbarComponent,
    LandingComponent,
    UploadComponentComponent,
    DecryptionComponent
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
