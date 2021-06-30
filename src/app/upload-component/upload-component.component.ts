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

  //TODO remove httpClient later, httpClient just for debugging
  constructor(private fileUploadService: FileUploadService,
              private httpClient: HttpClient,
              private sanitizer: DomSanitizer,
              private base64Service: Base64Service) {
  }

  onFileSelected(event: any) {
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.base64Output = base64;
      const fileInfo = this.getFileNameAndExtensionFromFile(this.uploadedFiles[0]);
      const info: Base64File = new Base64File(base64, fileInfo[0], fileInfo[1]);
      this.loaded = true;
      console.log(info);
      this.fileUploadService.sendBase64Request(info).pipe().subscribe( (data: string[][]) => {
        this.downloadEncryptedData(data);
        }
      );
      console.log(info);
    });
  }

  private downloadEncryptedData(data: string[][]) {
    this.triggerDownloadBase64String(data[0]);
    this.triggerDownloadBase64String(data[1]);
  }

  convertFile(file : File) : Observable<string> {
    this.loaded = false;
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    this.uploadedFiles[0] = file;
    reader.readAsBinaryString(file);
    // @ts-ignore
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }
//https://stackoverflow.com/questions/57922872/angular-save-blob-in-local-text-file
  public triggerDownloadBase64String(data: string[]) {
    //new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    //const blob = new Blob([data[0]], {type: 'application/json'});
    //debug
    /*console.log("downloading");
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));*/
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

  public clear(): void {
    this.uploadedFiles = [];
  }

  public seeFiles() {
    console.log(this.uploadedFiles);
  }

  public upload(): void {
    //this.fileUploadService.fireEncryption(this.uploadedFiles);
  }

  //debug
  public fireUpload() {
    const zip = this.zipFiles(this.uploadedFiles);
    console.log(zip);
    //das hier klappt noch nicht so richtig ... any -> file?
    /*this.convertFile(zip).pipe().subscribe((base64: string) => {
      console.log(base64);
    });*/
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

  addFile(event: any) {
    const file: File = event.target.files[0];
    if(file) {
      /*if(this.formData == undefined) {
        this.formData = new FormData();
      }
      this.formData.append(file.name, file);
      console.log(this.formData);
      this.uploadedFiles.push(file);
      this.httpClient.post(`${environment.api}/encrypt/single`, this.formData)
        .pipe().subscribe((data) => {
          console.log(data);
      });*/
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(reader.result);
      }


    }
  }

  //https://medium.com/@tchiayan/compressing-single-file-or-multiple-files-to-zip-format-on-client-side-6607a1eca662
  private zipFiles(files: Array<File>): JSZip {
    let zip = new JSZip();
    for(let file of files) {
      zip.file(file.name, file);
    }
    return zip;
  }

  public debug() {
    //this.getFileAsBase64(this.uploadedFiles[0]);
  }


  //TODO: Zip files then encode as base64

  private getFileNameAndExtensionFromFile(file: File): string[] {
    const names = file.name.split(".");
    const ret = [];
    ret[1] = names[names.length-1];
    ret[0] = file.name.substring(0, file.name.length - (ret[1].length+1));
    console.log(ret);
    return ret;
  }
}
