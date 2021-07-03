import {Injectable} from "@angular/core";
import {EncryptionService} from "../Encryption/service/encryption.service";
import {Base64File} from "../Base64File/model/Base64File";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Base64Service} from "../Base64File/service/Base64Service";
import {map} from "rxjs/operators";
import {DomSanitizer} from "@angular/platform-browser";
import {ExtendedBase64File} from "../Base64File/model/ExtendedBase64File";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private files: Array<File> = [];
  private fileUrl: any;

  constructor(private encryptionService: EncryptionService,
              private httpClient: HttpClient,
              private base64Service: Base64Service,
              private sanitizer: DomSanitizer) {
  }

  public sendBase64Request(base64File: Base64File) : Observable<string[][]> {
    return this.httpClient.post(`${environment.api}/encrypt/singlebase64`, base64File) as Observable<string[][]>;
  }

  public sendDecryptionRequest(extendedBase64File: ExtendedBase64File): Observable<Base64File> {
    return this.httpClient.post(`${environment.api}/decrypt/bundle`, extendedBase64File) as Observable<Base64File>;
  }

  //Answer by deitsch https://stackoverflow.com/questions/52182851/how-to-download-file-with-blob-function-using-angular-5
  /*public downloadEncryptedData(encryptedData: string[][]): void {
    //first
    this.triggerDownload(encryptedData[0]);
    this.triggerDownload(encryptedData[1]);
  }*/

  /*private triggerDownload(data: string[]) : void {
    /*const mapBlob = this.base64Service.dataURItoBlob(data[0]);
    const mapFileName = `${data[1]}.${data[2]}}`;

    const anchor = document.createElement('a');
    anchor.download = mapFileName;
    anchor.href = (window.webkitURL || window.URL).createObjectURL(mapBlob);
    anchor.click();*\/
    const base64File: Base64File = new Base64File(data[0], data[1], data[2]);
    //serialisieren und rausgeben
    console.log(JSON.stringify(base64File));
    this.downloadJSONFile(data);
  }*/

  public assignFiles(files: Array<File>): void {
    this.clear();
    for(let i = 0; i < files.length; i++) {
      this.files.push(files[i]);
    }
  }

  public clear() {
    this.files = [];
  }

  private getFileNameAndExtension(fileName:string): string[] {
    const fullFileName: string[] = fileName.split('.');
    const ret: string[] = [];
    ret.push(fullFileName[fullFileName.length-2]);
    ret.push(fullFileName[fullFileName.length-1]);
    return ret;
  }

  public fireEncryption(files: Array<File>): void {
    this.assignFiles(files);
    this.encryptionService.encrypt(files);
  }
}
