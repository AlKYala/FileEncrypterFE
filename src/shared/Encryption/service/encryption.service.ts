import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor(private httpClient: HttpClient) {
  }

  public encrypt(files: Array<File>): void {
    //TODO add conditions for single/multiple files later
    this.encryptSingleFile(files[0]);
  }

  private encryptSingleFile(file: File) {
    let headers: HttpHeaders = this.createUploadHeaders();
    return this.httpClient.post(`${environment.api}/encrypt/single`, file, {
      headers: headers
    }).pipe().subscribe((data) => {
      console.log(data);
      //TODO base64
      //TODO file download
    })
  }


  private createUploadHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundarym9rNf7EsEiv7jdhu');
    return headers;
  }

  /*private encryptMultipleFiles(file: File): Observable<string[][]> {
    return undefined; //TODO
  }*/
}
