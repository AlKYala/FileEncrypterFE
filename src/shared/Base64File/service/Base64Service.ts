import {Injectable} from "@angular/core";
import {Base64File} from "../model/Base64File";
import {Buffer} from "buffer";

@Injectable({
  providedIn: 'root'
})
export class Base64Service {
  // credit goes to: https://stackoverflow.com/questions/58502673/angular-8-parsing-base64-to-file
  /*public base64FileToFile(b64File: Base64File): void {
    /*const fullFileName = b64File.getFilenameWithExtension();
    const imageBlob = this.dataURItoBlob(b64File.base64);
    return new File([imageBlob], fullFileName);

    new idea: just serialize
    *\/
    console.log(JSON.stringify(b64File));
  }*/


  /*public dataURItoBlob(dataURI: string): Blob {
    const bytes = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(bytes.length);
    const int8Arr = new Uint8Array(arrayBuffer);
    for(let i = 0; i < bytes.length; i++) {
      int8Arr[i] = bytes.charCodeAt(i);
    }
    const blob = new Blob([int8Arr], {type: "application/octet-stream"});
    //gegen ende: 	application/zip
    return blob;
  }*/
}
