import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {EncryptionComponent} from "./encryption/encryption.component";
import {AppComponent} from "./app.component";
import {LandingComponent} from "./landing/landing.component";

const routes : Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'encrypt', component: EncryptionComponent},
  {path: 'home', component: LandingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
