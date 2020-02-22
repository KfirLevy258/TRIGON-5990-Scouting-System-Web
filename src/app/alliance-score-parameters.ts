export class FirstScoreParameters {

  constructor(public auto3BallsWeight: number,
              public auto10BallsWeight: number,
              public autoCollectWeight: number,
              public autoBallsAmount: number,
              public teleopBallsWeight: number,
              public teleopBallsAmount: number,
              public endGamesClimbSuccesses: number,
              public autoWeight: number,
              public teleopWeight: number,
              public endGameWeight: number) {
  }
}

export class SecondScoreParameters {

  constructor(public auto3BallsWeight: number,
              public auto10BallsWeight: number,
              public autoCollectWeight: number,
              public autoBallsAmount: number,
              public teleopBallsWeight: number,
              public teleopBallsAmount: number,
              public teleopRouletteWeight: number,
              public endGamesClimbSuccesses: number,
              public autoWeight: number,
              public teleopWeight: number,
              public endGameWeight: number) {
  }
}
