import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private getFileAsBase64(file: File): Observable<string> {
    return new Observable(obs => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        obs.next(reader.result as string);
        obs.complete();
      }
      reader.readAsDataURL(file);
    })
  }

  public adjustDataUrl(str: string): string {
    //erste occurence von ',' finden!
    const startIndex = this.findFirstIndexOfCharacter(str, ',');
    return str.substring(startIndex+1, str.length);
  }

  private findFirstIndexOfCharacter(str: string, char: string) {
    for(let i = 0; i < str.length; i++) {
      if(str.charAt(i) == char) {
        return i;
      }
    }
    return -1;
  }
}
