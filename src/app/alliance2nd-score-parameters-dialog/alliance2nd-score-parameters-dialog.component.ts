import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SecondScoreParameters} from '../alliance-score-parameters';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-alliance2nd-score-parameters-dialog',
  templateUrl: './alliance2nd-score-parameters-dialog.component.html',
  styleUrls: ['./alliance2nd-score-parameters-dialog.component.scss']
})
export class Alliance2ndScoreParametersDialogComponent implements OnInit {

  dialogTitle: string;
  form: FormGroup;
  scoreParameters: SecondScoreParameters;

  constructor(private dialogRef: MatDialogRef<Alliance2ndScoreParametersDialogComponent>,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) data) {

    this.dialogTitle = data.dialogTitle;
    this.scoreParameters = data.scoreParameters;

    this.form = fb.group({
      auto3BallsWeight: [this.scoreParameters.auto3BallsWeight, [Validators.required]],
      auto10BallsWeight: [this.scoreParameters.auto10BallsWeight, [Validators.required]],
      autoCollectWeight: [this.scoreParameters.autoCollectWeight, [Validators.required]],
      autoBallsAmount: [this.scoreParameters.autoBallsAmount, [Validators.required]],
      teleopBallsWeight: [this.scoreParameters.teleopBallsWeight, [Validators.required]],
      teleopBallsAmount: [this.scoreParameters.teleopBallsAmount, [Validators.required]],
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
    const updatedScoreParameters = new SecondScoreParameters(
      Number(values.auto3BallsWeight),
      Number(values.auto10BallsWeight),
      Number(values.autoCollectWeight),
      Number(values.autoBallsAmount),
      Number(values.teleopBallsWeight),
      Number(values.teleopBallsAmount),
      Number(values.teleopRouletteWeight),
      Number(values.endGamesClimbSuccesses),
      Number(values.autoWeight),
      Number(values.teleopWeight),
      Number(values.endGameWeight),
    );
    this.dialogRef.close(updatedScoreParameters);
  }

}
