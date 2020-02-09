import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-dialog-alliances',
  templateUrl: './dialog-alliances.component.html',
  styleUrls: ['./dialog-alliances.component.scss']
})
export class DialogAlliancesComponent implements OnInit {
  dialogTitle: string;
  form: FormGroup;

  constructor(private dialogRef: MatDialogRef<DialogAlliancesComponent>,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data) {

    this.dialogTitle = data.dialogTitle;

    this.form = fb.group({
      blue1: ['', [Validators.required]],
      blue2: ['', [Validators.required]],
      blue3: ['', [Validators.required]],
      red1: ['', [Validators.required]],
      red2: ['', [Validators.required]],
      red3: ['', [Validators.required]]
    });
  }
  ngOnInit() {

  }

  cancel() {
    this.dialogRef.close(false);
  }

  ok() {
    const values = this.form.getRawValue();
    this.dialogRef.close({
      blueTeams: [values.blue1, values.blue2, values.blue3],
      redTeams: [values.red1, values.red2, values.red3]
    });
  }
}
