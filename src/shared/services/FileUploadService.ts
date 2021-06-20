import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private files: Array<File> = [];

  public assignFiles(files: Array<File>): void {
    this.clear();
    for(let i = 0; i < files.length; i++) {
      this.files.push(files[i]);
    }
  }

  public clear() {
    this.files = [];
  }

  public filesToBase64(): string[][] {
    const filesInBase64: string[][]
  }

  private getFileNameAndExtension(fileName:string): string[] {
    const fullFileName: string[] = fileName.split('.');
    const ret: string[] = [];
    ret.push(fullFileName[fullFileName.length-2]);
    ret.push(fullFileName[fullFileName.length-1]);
    return ret;
  }

  private processFile(file: File): string[] {
    const data: string[] = [];
    const fileNameSplit: string[] = this.getFileNameAndExtension(file.name);
    //TODO index 0 has base64 representation
    data.push(fileNameSplit[0]);
    data.push(fileNameSplit[1]);
  }
}
