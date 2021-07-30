import {Base64File} from "./Base64File";

export class ExtendedBase64File {
  public content: Base64File;
  public frame: Base64File;

  public constructor() {
    this.content = new Base64File("", "", "");
    this.frame = new Base64File("", "", "");
  }

  public setContent(file: Base64File): void {
    this.content = file;
  }

  public setFrame(file: Base64File): void {
    this.frame = file;
  }
}
