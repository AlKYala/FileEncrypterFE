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



  private getFileNameAndExtension(fileName:string): string[] {
    const fullFileName: string[] = fileName.split('.');
    const ret: string[] = [];
    ret.push(fullFileName[fullFileName.length-2]);
    ret.push(fullFileName[fullFileName.length-1]);
    return ret;
  }
}
