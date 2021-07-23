import { Component, OnInit } from '@angular/core';
import {FileUploadControl, FileUploadValidators} from "@iplab/ngx-file-upload";
import {FormControl, FormGroup} from "@angular/forms";
import {FileUploadService} from "../../shared/services/FileUploadService";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable, ReplaySubject} from "rxjs";
import {Base64File} from "../../shared/Base64File/model/Base64File";
import {DomSanitizer} from "@angular/platform-browser";
import * as JSZip from "jszip";
import {Base64Service} from "../../shared/Base64File/service/Base64Service";

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

  public seeFiles() {
    console.log(this.uploadedFiles);
  }

  public upload(): void {
    //this.fileUploadService.fireEncryption(this.uploadedFiles);
  }

  public fireUpload() {
    const zip = UploadComponentComponent.zipFiles(this.uploadedFiles);
    zip.generateAsync({
      type: "base64",
    }).then((data: string) => {
      //this is the base64
      const base64Bundled: Base64File = new Base64File(data, "bundled", "zip");
      this.fileUploadService.sendBase64Request(base64Bundled).pipe().subscribe((response: string[][]) => {
        this.downloadEncryptedData(response);
      });
      });
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
    const base64File: Base64File = new Base64File(data[0], data[1], data[2]);
    let a = document.createElement("a");
    document.body.appendChild(a);
    const base64FileJson: string = JSON.stringify(base64File);
    const blob = new Blob([base64FileJson], {type: "octet/stream"});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = (data[2] === 'map') ? `${base64File.fileName}.${base64File.fileExtension}` : `${base64File.fileName}.encrypted`;
    a.click();
    console.log("click");
    window.URL.revokeObjectURL(url);
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
