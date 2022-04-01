import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  templateUrl: './settings_dialog.component.html',
  styleUrls: ['./settings_dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsDialogComponent {
  width = 0;
  height = 0;

  constructor(
    private readonly dialogRef: MatDialogRef<
      SettingsDialogComponent,
      SettingsDialogData
    >,
    @Inject(MAT_DIALOG_DATA) data: SettingsDialogData
  ) {
    this.width = data.width;
    this.height = data.height;
  }

  clickApply() {
    this.dialogRef.close({
      width: this.width,
      height: this.height,
    });
  }
}

export interface SettingsDialogData {
  width: number;
  height: number;
}
