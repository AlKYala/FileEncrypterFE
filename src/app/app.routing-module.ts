import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {EncryptionComponent} from "./encryption/encryption.component";

const routes : Routes = [
  {path: 'encrypt', component: EncryptionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
