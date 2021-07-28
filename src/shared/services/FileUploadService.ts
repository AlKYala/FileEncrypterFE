import {Injectable} from "@angular/core";
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

  constructor(private httpClient: HttpClient,
              private base64Service: Base64Service,
              private sanitizer: DomSanitizer) {
  }

  /**
   * Sends a base64File as a request - receives a 2d dimensional string of length 3
   * for the 3 files that are downloaded - data for the content file, parent file and map file
   * @param base64File
   */
  public sendBase64Request(base64File: Base64File) : Observable<string[][]> {
    return this.httpClient.post(`${environment.api}/encrypt/singlebase64`, base64File) as Observable<string[][]>;
  }

  /**
   * See FileUploadService::sendBase64Request but this returns an instance of extendedBase64File
   * Instances of ExtendedBase64File class make communication more abstract
   * @param extendedBase64File
   */
  public sendDecryptionRequest(extendedBase64File: ExtendedBase64File): Observable<Base64File> {
    return this.httpClient.post(`${environment.api}/decrypt/bundle`, extendedBase64File) as Observable<Base64File>;
  }

  public assignFiles(files: Array<File>): void {
    this.clear();
    for(let i = 0; i < files.length; i++) {
      this.files.push(files[i]);
    }
  }

  public clear() {
    this.files = [];
  }

  /**
   * takes a filename with ending and splits filename without ending and ending up and returns both
   * in an array, where filename has index 0, file extension has index 1
   * @param fileName
   */
  public getFileNameAndExtension(fileName:string): string[] {
    const fullFileName: string[] = fileName.split('.');
    const ret: string[] = [];
    ret.push(fullFileName[fullFileName.length-2]);
    ret.push(fullFileName[fullFileName.length-1]);
    return ret;
  }
}
