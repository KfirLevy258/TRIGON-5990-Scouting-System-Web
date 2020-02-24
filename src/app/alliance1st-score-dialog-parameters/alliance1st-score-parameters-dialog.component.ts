import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FirstScoreParameters} from '../alliance-score-parameters';


@Component({
  selector: 'app-alliance-score-parameters',
  templateUrl: './alliance1st-score-parameters-dialog.component.html',
  styleUrls: ['./alliance1st-score-parameters-dialog.component.scss']
})
export class Alliance1stScoreParametersDialogComponent implements OnInit {

  dialogTitle: string;
  form: FormGroup;
  scoreParameters: FirstScoreParameters;

  constructor(private dialogRef: MatDialogRef<Alliance1stScoreParametersDialogComponent>,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data) {

    this.dialogTitle = data.dialogTitle;
    this.scoreParameters = data.scoreParameters;

    this.form = fb.group({
      autoBallsWeight: [this.scoreParameters.autoBallsWeight, [Validators.required]],
      autoCollectWeight: [this.scoreParameters.autoCollectWeight, [Validators.required]],
      autoBallsAmount: [this.scoreParameters.autoBallsAmount, [Validators.required]],
      teleopBallsWeight: [this.scoreParameters.teleopBallsWeight, [Validators.required]],
      endGamesClimbSuccesses: [this.scoreParameters.endGamesClimbSuccesses, [Validators.required]],
      autoWeight: [this.scoreParameters.autoWeight, [Validators.required]],
      teleopWeight: [this.scoreParameters.teleopWeight, [Validators.required]],
      endGameWeight: [this.scoreParameters.endGameWeight, [Validators.required]],

    });
  }
  ngOnInit() {
    console.log(this.scoreParameters);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  ok() {
    const values = this.form.getRawValue();
    const updatedScoreParameters = new FirstScoreParameters(
      Number(values.autoBallsWeight),
      Number(values.autoCollectWeight),
      Number(values.autoBallsAmount),
      Number(values.teleopBallsWeight),
      Number(values.endGamesClimbSuccesses),
      Number(values.autoWeight),
      Number(values.teleopWeight),
      Number(values.endGameWeight),
    );
    this.dialogRef.close(updatedScoreParameters);
  }

}
