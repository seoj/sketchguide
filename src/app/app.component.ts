import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FileSevice} from './file.service';
import {toAspectRatio, toImage} from './functions';
import {
  SettingsDialogComponent,
  SettingsDialogData,
} from './settings_dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  private originalImage?: HTMLImageElement;
  private scaledImage?: HTMLImageElement;
  private zoomHistory: Zoom[] = [];
  private canvasWidth = 11;
  private canvasHeight = 8.5;

  @ViewChild('canvas')
  canvasElementRef?: ElementRef<HTMLCanvasElement>;

  constructor(
    private readonly fileService: FileSevice,
    private readonly dialog: MatDialog
  ) {
    this.resetZoom();
  }

  ngAfterViewInit() {
    window.addEventListener('resize', () => {
      this.draw();
    });
    this.draw();
  }

  clickCanvas(event: MouseEvent) {
    if (!this.scaledImage) {
      return;
    }

    const canvas = this.canvas;
    const midX = canvas.width / 2;
    const midY = canvas.height / 2;
    const zoom = {
      magnitude: this.currentZoom.magnitude + 1,
      x: this.currentZoom.x,
      y: this.currentZoom.y,
    };

    if (event.offsetX > midX) {
      zoom.x += 2 ** -zoom.magnitude * this.scaledImage.width;
    }
    if (event.offsetY > midY) {
      zoom.y += 2 ** -zoom.magnitude * this.scaledImage.height;
    }

    this.zoomHistory.push(zoom);
    this.draw();
  }

  clickBackButton() {
    if (this.zoomHistory.length === 1) {
      return;
    }

    this.zoomHistory.pop();
    this.draw();
  }

  clickSettingsButton() {
    const dialogRef = this.dialog.open<
      SettingsDialogComponent,
      SettingsDialogData,
      SettingsDialogData
    >(SettingsDialogComponent, {
      data: {
        width: this.canvasWidth,
        height: this.canvasHeight,
      },
    });

    dialogRef.afterClosed().subscribe(async data => {
      if (!data) {
        return;
      }

      this.canvasWidth = data.width;
      this.canvasHeight = data.height;
      await this.updateScaledImage();
      this.draw();
    });
  }

  private get canvas() {
    return this.canvasElementRef!.nativeElement;
  }

  private get currentZoom() {
    return this.zoomHistory[this.zoomHistory.length - 1];
  }

  private draw() {
    if (!this.scaledImage) {
      return;
    }

    const canvas = this.canvas;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext('2d')!;
    const imageAspectRatio = this.scaledImage.width / this.scaledImage.height;
    const parentAspectRatio = parent.clientWidth / parent.clientHeight;
    if (imageAspectRatio < parentAspectRatio) {
      canvas.height = parent.clientHeight;
      canvas.width = canvas.height * imageAspectRatio;
    } else {
      canvas.width = parent.clientWidth;
      canvas.height = canvas.width / imageAspectRatio;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      this.scaledImage,
      this.currentZoom.x,
      this.currentZoom.y,
      2 ** -this.currentZoom.magnitude * this.scaledImage.width,
      2 ** -this.currentZoom.magnitude * this.scaledImage.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.strokeStyle = 'cyan';
    ctx.moveTo(canvas.width * 0.5, 0);
    ctx.lineTo(canvas.width * 0.5, canvas.height);
    ctx.moveTo(0, canvas.height * 0.5);
    ctx.lineTo(canvas.width, canvas.height * 0.5);
    ctx.stroke();
  }

  async clickCameraButton() {
    const files = await this.fileService.read('image/*');
    if (!files) {
      return;
    }
    this.originalImage = await toImage(files[0]);
    await this.updateScaledImage();
    this.draw();
  }

  private async updateScaledImage() {
    if (!this.originalImage) {
      return;
    }

    this.scaledImage = await toAspectRatio(
      this.originalImage,
      this.aspectRatio
    );
    this.resetZoom();
  }

  private resetZoom() {
    this.zoomHistory = [
      {
        magnitude: 0,
        x: 0,
        y: 0,
      },
    ];
  }

  private get aspectRatio() {
    return this.canvasWidth / this.canvasHeight;
  }
}

interface Zoom {
  magnitude: number;
  x: number;
  y: number;
}
