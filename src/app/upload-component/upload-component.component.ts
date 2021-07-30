import { Component, OnInit } from '@angular/core';
import {FileUploadControl, FileUploadValidators} from "@iplab/ngx-file-upload";
import {FormControl, FormGroup} from "@angular/forms";
import {FileUploadService} from "../../shared/services/FileUploadService";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {from, Observable, ReplaySubject} from "rxjs";
import {Base64File} from "../../shared/Base64File/model/Base64File";
import {DomSanitizer} from "@angular/platform-browser";
import * as JSZip from "jszip";
import {Base64Service} from "../../shared/Base64File/service/Base64Service";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-upload-component',
  templateUrl: './upload-component.component.html',
  styleUrls: ['./upload-component.component.css']
})
export class UploadComponentComponent {

  public uploadedFiles: Array<File> = [];
  private formData: FormData = new FormData();
  private loaded: boolean = false;
  public fileUrl: any;

  base64Output : string = "";

  constructor(private fileUploadService: FileUploadService) {

  }

  public clear(): void {
    this.uploadedFiles = [];
  }

  /**
   * Zips files saved in UploadComponentComponent::uploadedFiles, converts that zip into base64
   * and sends it to backend
   */
  public fireUpload() {
    const zip = UploadComponentComponent.zipFiles(this.uploadedFiles);
    this.zipPromiseToObservable(zip).pipe(
      switchMap((zipAsBase64: string) => {
        const base64Bundled: Base64File = new Base64File(zipAsBase64, "bundled", "zip");
        return this.fileUploadService.sendBase64Request(base64Bundled);
      })).subscribe((response: string[][]) => {
        this.downloadEncryptedData(response);
    });
  }

  /**
   * Method used in UploadComponentComponent::fireUpload to encode a zip instance to base64
   * @param zip the zip to encode to base64
   */
  private zipPromiseToObservable(zip: JSZip): Observable<string> {
    return from(zip.generateAsync(
      {
        type: "base64",
      }
    ));
  }

  /**
   * Fired by fireUpload()
   * this method is used to download the encrypted files
   * The response by the backend is a 2 Dimensional array of strings of length 3
   * Each array holds 3 elements (3x3)
   * A download for the files is then triggered for all files
   * @param data The response by the backend - a 2d array
   */
  private downloadEncryptedData(data: string[][]) {
    this.triggerDownloadBase64String(data[0]);
    this.triggerDownloadBase64String(data[1]);
    this.triggerDownloadBase64String(data[2]);
  }

  //https://stackoverflow.com/questions/57922872/angular-save-blob-in-local-text-file
  /**
   * Takes an array of length 3 with property values for a Base64File instance
   * It is then downloaded
   * @param data The values for the base64 file
   */
  public triggerDownloadBase64String(data: string[]) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    const blob = this.createBase64FileBlobFromData(data);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = (data[2] == 'zip') ? `${data[1]}.encrypted` : `${data[1]}.${data[2]}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Takes the base64 URI of a file, filename and fileextension from a string array, instantiates a Base64File
   * instance from it then creates a Blob from its json represenation
   * @param data
   * @private
   */
  private createBase64FileBlobFromData(data: string[]): Blob {
    const base64File: Base64File = new Base64File(data[0], data[1], data[2]);
    const base64FileJson: string = JSON.stringify(base64File);
    const blob = new Blob([base64FileJson], {type: "octet/stream"});
    return blob;
  }

  /**
   * Takes the parent file and map file creates a zip from it - so the user only has to keep 2 files
   * the encrypted data and the zip with map, parent and a created readme file
   * @param keyfiles a 2d array that holds the data for the map file (index 0) and parent file (index 1)
   *
   * UNUSED
   */
  private zipKey(keyfiles: string[][]) {
    /*const mapBlob: Blob = this.createBase64FileBlobFromData(keyfiles[0]);
    const parentBlob: Blob = this.createBase64FileBlobFromData(keyfiles[1]);
    const keyzip: JSZip = new JSZip();
    //keyzip.file*/
  }



  //https://medium.com/@tchiayan/compressing-single-file-or-multiple-files-to-zip-format-on-client-side-6607a1eca662
  /**
   * Takes an array of files and generates a zip instance
   * @param files The array of files to zip
   */
  private static zipFiles(files: Array<File>): JSZip {
    let zip = new JSZip();
    for(let file of files) {
      zip.file(file.name, file);
    }
    return zip;
  }
}
