import {Injectable} from "@angular/core";
import {Base64File} from "../model/Base64File";
import {Buffer} from "buffer";

@Injectable({
  providedIn: 'root'
})
export class Base64Service {
  // credit goes to: https://stackoverflow.com/questions/58502673/angular-8-parsing-base64-to-file

  /**
   * Takes a base64 string and returns it as blob - to support downloads
   * @param dataURI The base64 string
   */
  public dataURItoBlob(dataURI: string): Blob {
    const bytes = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(bytes.length);
    const int8Arr = new Uint8Array(arrayBuffer);
    for(let i = 0; i < bytes.length; i++) {
      int8Arr[i] = bytes.charCodeAt(i);
    }
    const blob = new Blob([int8Arr], {type: "application/octet-stream"});
    //gegen ende: 	application/zip
    return blob;
  }
}
