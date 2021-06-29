export class Base64File {
  public base64: string;
  public fileName: string;
  public fileExtension: string;

  public constructor(base64: string, fileName: string, fileExtension: string) {
    this.base64 = base64;
    this.fileName = fileName;
    this.fileExtension = fileExtension;
  }

  public getFilenameWithExtension(): string {
    return `${this.fileName}.${this.fileExtension}`;
  }
}
