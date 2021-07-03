import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {EncryptionComponent} from "./encryption/encryption.component";
import {AppComponent} from "./app.component";
import {LandingComponent} from "./landing/landing.component";
import {DecryptionComponent} from "./decryption/decryption.component";

const routes : Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'encrypt', component: EncryptionComponent},
  {path: 'home', component: LandingComponent},
  {path: 'decrypt', component: DecryptionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
