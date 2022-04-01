import {Injectable} from '@angular/core';

@Injectable()
export class FileSevice {
  read(accept = ''): Promise<FileList | null> {
    return new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.addEventListener('input', () => {
        resolve(input.files);
      });
      input.click();
    });
  }
}
