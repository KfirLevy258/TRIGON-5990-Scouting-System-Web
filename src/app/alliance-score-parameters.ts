export class FirstScoreParameters {

  constructor(public autoBallsWeight: number,
              public autoCollectWeight: number,
              public autoBallsAmount: number,
              public teleopBallsWeight: number,
              public endGamesClimbSuccesses: number,
              public autoWeight: number,
              public teleopWeight: number,
              public endGameWeight: number) {
    // this.autoBallsWeight = 0.75;
    // this.autoCollectWeight =  0.25;
    // this.autoBallsAmount =  10;
    // this.teleopBallsWeight =  1;
    // this.endGamesClimbSuccesses =  1;
    // this.autoWeight =  0.15;
    // this.teleopWeight =  0.6;
    // this.endGameWeight =  0.25;
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
