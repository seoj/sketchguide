import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-bar',
  templateUrl: './app_bar.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBarComponent {
  @Output('clickCameraButton')
  clickCameraButtonEventEmittter = new EventEmitter<void>();

  @Output('clickBackButton')
  clickBackButtonEventEmitter = new EventEmitter<void>();

  @Output('clickSettingsButton')
  clickSettingsButtonEventEmitter = new EventEmitter<void>();

  clickCameraButton() {
    this.clickCameraButtonEventEmittter.emit();
  }

  clickBackButton() {
    this.clickBackButtonEventEmitter.emit();
  }

  clickSettingsButton() {
    this.clickSettingsButtonEventEmitter.emit();
  }
}
