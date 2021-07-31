import {Base64File} from "./Base64File";

export class ExtendedBase64File {
  public content: Base64File;
  public key: Base64File;
  public parent: Base64File;

  public constructor() {
    this.content = new Base64File("", "", "");
    this.key = new Base64File("", "", "");
    this.parent = new Base64File("", "", "");
  }

  public setContent(file: Base64File): void {
    this.content = file;
  }

  public setKey(file: Base64File): void {
    this.key = file;
  }

  public setParent(file: Base64File): void {
    this.parent = file;
  }
}
