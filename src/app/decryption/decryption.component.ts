import { Component, OnInit } from '@angular/core';
import {FileUploadService} from "../../shared/services/FileUploadService";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {Base64Service} from "../../shared/Base64File/service/Base64Service";
import {Base64File} from "../../shared/Base64File/model/Base64File";
import {ExtendedBase64File} from "../../shared/Base64File/model/ExtendedBase64File";
import {from, Observable} from "rxjs";
import {switchMap} from "rxjs/operators";
import {CustomFile} from "../../shared/Base64File/CustomFile/model/CustomFile";

@Component({
  selector: 'app-decryption',
  templateUrl: './decryption.component.html',
  styleUrls: ['./decryption.component.css']
})
export class DecryptionComponent implements OnInit {

  public uploadedFiles: Array<File> = [];
  public customFiles: Array<CustomFile> = [];

  constructor(private fileUploadService: FileUploadService,
              private httpClient: HttpClient,
              private sanitizer: DomSanitizer,
              private base64Service: Base64Service) {
    const placeHolderCustom = {file: this.getEmptyFile(), fileName: "", fileExtension: ""};
    for(let i = 0; i < 3; i++) {
      this.customFiles[i] = placeHolderCustom;
    }
  }

  ngOnInit(): void {
  }

  /**
   * A method that does:
   * 1. Takes encrypted files that are uploaded sends them to backend
   * 2. Waits for backend response
   * 3. Converts the response into a blob and triggers the download of that file
   * NOTE: The downloaded file is in .zip format because in encryption there
   * is no limit on how many files are encrypted at once
   */
  public fireUpload() {
    if(this.uploadedFiles.length != 3) {
      console.log("debug error message");
    }
    let extendedBase64: ExtendedBase64File;
    this.stringsAsObservable(this.filesToStringArr(this.uploadedFiles)).pipe(
      switchMap((data: string[]) => {
        extendedBase64 = this.extendedBase64FileFromStringArray(data);
        return this.fileUploadService.sendDecryptionRequest(extendedBase64);
      }
    )).subscribe((data:Base64File) => {
      this.triggerDownloadBase64String(data.base64);
    });
  }

  //https://stackoverflow.com/questions/50182259/avoiding-nested-promises-in-angular
  /**
   * Takes an array of files, converts them into strings
   * Used to transform files into strings for base64 conversion
   * @param files The array of files
   * @private
   */
  private async filesToStringArr(files: Array<File>): Promise<string[]> {
    let results: string[];
    results = [];
    try {
      await files[0].text().then((response: string) => {
        results.push(response);
      });
      await files[1].text().then((response: string) => {
        results.push(response);
      });
      await files[2].text().then((response: string) => {
        results.push(response);
      });
    } catch(err) {
      console.log(err);
    }
    return results;
  }

  /**
   * Converts a promise for a string array
   * @param stringPromise
   * @private
   */
  private stringsAsObservable(stringPromise: Promise<string[]>): Observable<string[]> {
    return from(stringPromise) as Observable<string[]>;
  }
  /**
   * Only 3 strings are accepted, see above
   * @param values 3 strings in an array to make an array of 3 Base64Files from.
   */
  private stringsToBase64Files(values: string[]): Base64File[] {
    return [this.readBase64File(values[0]), this.readBase64File(values[1])];
  }

  /**
   * A method to make an ExtendedBase64File instance from an array of strings
   * @param arr A string array of 3 values. One for filename, one for filextension and one with the base64 encoding
   */
  private extendedBase64FileFromStringArray(arr: string[]) {
    return this.bundleBase64Files(this.stringsToBase64Files(arr));
  }

  /**
   * Takes a Base64File encoded as JSON-String
   * This step happens when Backend sends back Base64Files
   * @param content
   * @private
   */
  private readBase64File(content: string): Base64File {
    const parsed = (JSON.parse(content));
    return new Base64File(parsed.base64, parsed.fileName, parsed.fileExtension);
  }

  /**
   * Takes an array of Base64 Files and bundles it to an ExtendedBase64File for easier
   * communication between frontend and backend
   * @param files multiple instances of Base64File to be
   */
  private bundleBase64Files(files: Base64File[]): ExtendedBase64File {
    const extendedB64: ExtendedBase64File = new ExtendedBase64File();
    for(let i = 0; i < files.length; i++) {
      switch(files[i].fileExtension) {
        case 'frame': extendedB64.setFrame(files[i]); break;
        default: extendedB64.setContent(files[i]);
      }
    }
    return extendedB64;
  }

  //I would put this in a service but I have to modify the htmldom
  /**
   * Takes a base64-encoded string and produces a file which is then triggered for download
   * NOTE: It would be much better to put this in a service than duplicate logic but the HTMLDOM needs
   * to be manipulated
   * @param data The data to convert to zip and download
   */
  private triggerDownloadBase64String(data: string) {
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

  /**
   * Create a placeholder file instance for CustomFile instances
   * @private
   */
  private getEmptyFile(): File {
    return new File([], "");
  }

  public setCustomFile(index: number, file: File) {
    const names: string[] = this.fileUploadService.getFileNameAndExtension(file.name);
    this.customFiles[index] = {file: file, fileName: names[0], fileExtension: names[1]};
  }
}
