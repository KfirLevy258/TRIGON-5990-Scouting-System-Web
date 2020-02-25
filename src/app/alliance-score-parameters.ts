export class FirstScoreParameters {

  constructor(public autoBallsWeight: number,
              public autoCollectWeight: number,
              public autoBallsAmount: number,
              public teleopBallsWeight: number,
              public endGamesClimbSuccesses: number,
              public autoWeight: number,
              public teleopWeight: number,
              public endGameWeight: number) {
  }
}

export class SecondScoreParameters {

  constructor(public autoBallsWeight: number,
              public autoCollectWeight: number,
              public autoBallsAmount: number,
              public teleopBallsWeight: number,
              public teleopRouletteWeight: number,
              public endGamesClimbSuccesses: number,
              public autoWeight: number,
              public teleopWeight: number,
              public endGameWeight: number) {
  }
}
