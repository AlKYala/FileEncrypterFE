import {Base64File} from "./Base64File";

export class ExtendedBase64File {
  public content: Base64File;
  public key: Base64File;

  public constructor(content: Base64File, key: Base64File) {
    this.content = content;
    this.key = key;
  }
}
