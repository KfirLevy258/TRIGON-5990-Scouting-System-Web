import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog-alert',
  templateUrl: './dialog-alert.component.html',
  styleUrls: ['./dialog-alert.component.scss']
})
export class DialogAlertComponent {

  dialogTitle: string;
  message: string;

  constructor(private dialogRef: MatDialogRef<DialogAlertComponent>,
              @Inject(MAT_DIALOG_DATA) data) {

    this.dialogTitle = data.dialogTitle;
    this.message = data.message;
  }


  ok() {
    this.dialogRef.close();
  }

}
