import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-verify-dialog',
  templateUrl: './dialog-verify.component.html',
  styleUrls: ['./dialog-verify.component.scss']
})
export class DialogVerifyComponent {

  dialogTitle: string;
  message: string;

  constructor(private dialogRef: MatDialogRef<DialogVerifyComponent>,
              @Inject(MAT_DIALOG_DATA) data) {

    this.dialogTitle = data.dialogTitle;
    this.message = data.message;
  }

  cancel() {
    this.dialogRef.close(false);
  }

  ok() {
    this.dialogRef.close(true);
  }
}
