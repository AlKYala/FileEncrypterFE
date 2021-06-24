import {Injectable} from "@angular/core";
import {EncryptionService} from "../Encryption/service/encryption.service";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private files: Array<File> = [];

  constructor(private encryptionService: EncryptionService) {
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
