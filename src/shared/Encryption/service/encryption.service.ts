import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor(private httpClient: HttpClient) {
  }

  public encrypt(files: Array<File>): Observable<string[][]> {
    return this.encryptSingleFile(files[0]);
  }

  private encryptSingleFile(file: File): Observable<string[][]> {
    return this.httpClient.post(`${environment.api}/encrypt/single`, file) as Observable<string[][]>;
  }

  /*private encryptMultipleFiles(file: File): Observable<string[][]> {
    return undefined; //TODO
  }*/
}
