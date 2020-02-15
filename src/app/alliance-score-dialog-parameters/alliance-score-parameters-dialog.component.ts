import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export class ScoreParameters {
  auto3BallsWeight: number;
  auto10BallsWeight: number;
  autoCollectWeight: number;
  autoBallsAmount: number;
  teleopBallsWeight: number;
  teleopBallsAmount: number;
  endGamesClimbSuccesses: number;
  autoWeight: number;
  teleopWeight: number;
  endGameWeight: number;
}

@Component({
  selector: 'app-alliance-score-parameters',
  templateUrl: './alliance-score-parameters-dialog.component.html',
  styleUrls: ['./alliance-score-parameters-dialog.component.scss']
})
export class AllianceScoreParametersDialogComponent implements OnInit {

  dialogTitle: string;
  form: FormGroup;
  scoreParameters: ScoreParameters;

  constructor(private dialogRef: MatDialogRef<AllianceScoreParametersDialogComponent>,
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
    const updatedScoreParameters = new ScoreParameters();
    updatedScoreParameters.auto3BallsWeight = Number(values.auto3BallsWeight);
    updatedScoreParameters.auto10BallsWeight = Number(values.auto10BallsWeight);
    updatedScoreParameters.autoCollectWeight = Number(values.autoCollectWeight);
    updatedScoreParameters.autoBallsAmount = Number(values.autoBallsAmount);
    updatedScoreParameters.teleopBallsWeight = Number(values.teleopBallsWeight);
    updatedScoreParameters.teleopBallsAmount = Number(values.teleopBallsAmount);
    updatedScoreParameters.endGamesClimbSuccesses = Number(values.endGamesClimbSuccesses);
    updatedScoreParameters.autoWeight = Number(values.autoWeight);
    updatedScoreParameters.teleopWeight = Number(values.teleopWeight);
    updatedScoreParameters.endGameWeight = Number(values.endGameWeight);

    this.dialogRef.close(updatedScoreParameters);
  }

}
