import { Component, OnInit } from '@angular/core';
import {FileUploadService} from "../../shared/services/FileUploadService";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {Base64Service} from "../../shared/Base64File/service/Base64Service";
import {Base64File} from "../../shared/Base64File/model/Base64File";
import {ExtendedBase64File} from "../../shared/Base64File/model/ExtendedBase64File";

@Component({
  selector: 'app-decryption',
  templateUrl: './decryption.component.html',
  styleUrls: ['./decryption.component.css']
})
export class DecryptionComponent implements OnInit {

  public uploadedFiles: Array<File> = [];
  private formData: FormData = new FormData();
  private loaded: boolean = false;
  public fileUrl: any;

  constructor(private fileUploadService: FileUploadService,
              private httpClient: HttpClient,
              private sanitizer: DomSanitizer,
              private base64Service: Base64Service) {
  }

  ngOnInit(): void {
  }

  public fireUpload() {
    if(this.uploadedFiles.length != 3) {
      console.log("debug error message");
    }
    this.uploadedFiles[0].text().then((response: string) => {
      const first: Base64File = this.readBase64File(response);
      this.uploadedFiles[1].text().then((response2: string) => {
        const second: Base64File = this.readBase64File(response2);
        this.uploadedFiles[2].text().then((response3: string) => {
          const third: Base64File = this.readBase64File(response3);
          const bundled: ExtendedBase64File = this.bundleBase64Files([first, second, third]);
          console.log(JSON.stringify(bundled));
          this.fileUploadService.sendDecryptionRequest(bundled).pipe().subscribe((data: Base64File) => {
            console.log(data);
            console.log(data.base64);
            //TODO base64 to file
            this.triggerDownloadBase64String(data.base64);
          })
        })
      });
    });
  }

  private readBase64File(content: string): Base64File {
    const parsed = (JSON.parse(content));
    return new Base64File(parsed.base64, parsed.fileName, parsed.fileExtension);
  }

  private bundleBase64Files(files: Base64File[]): ExtendedBase64File {
    const extendedB64: ExtendedBase64File = new ExtendedBase64File();
    for(let i = 0; i < files.length; i++) {
      switch(files[i].fileExtension) {
        case 'map': extendedB64.setKey(files[i]); break;
        case 'parent': extendedB64.setParent(files[i]); break;
        default: extendedB64.setContent(files[i]);
      }
    }
    return extendedB64;
  }

  //I would put this in a service but I have to modify the htmldom
  public triggerDownloadBase64String(data: string) {
    let a = document.createElement("a");
    document.body.appendChild(a);
    const blob = new Blob([this.base64Service.dataURItoBlob(data)], {type: "octet/stream"});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "encrypted.zip";
    a.click();
    console.log("click");
    window.URL.revokeObjectURL(url);
  }
}
