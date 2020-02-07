import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';
import {range} from "rxjs";
import {log} from "util";

export class LineCoeffs {
  m: number;
  n: number;
}

export class AutoUpperShot {
  innerScore: number;
  outerScore: number;
  shots: number;
}

export class TeleopUpperShot {
  x: number;
  y: number;
  innerScore: number;
  outerScore: number;
  shots: number;
}

export class Game {
  gameNumber: string;
  color: string;
  gameWon: boolean;

  // preGame
  startingPosition: string;

  // Auto
  autoPowerCellsOnAutoEnd: number;
  autoBottomScore: number;
  autoBottomShots: number;
  autoTrenchCollect: Array<boolean> = [];
  autoClimbCollect: Array<boolean> = [];

  climbBallCollected1: boolean;
  climbBallCollected2: boolean;
  climbBallCollected3: boolean;
  climbBallCollected4: boolean;
  climbBallCollected5: boolean;
  autoInnerScore: number;
  autoOuterScore: number;
  trenchBallCollected1: boolean;
  trenchBallCollected2: boolean;
  trenchBallCollected3: boolean;
  trenchBallCollected4: boolean;
  trenchBallCollected5: boolean;
  autoUpperTotalShots: number;
  autoUpperShots: Array<AutoUpperShot> = [];

  // Teleop
  teleopBottomScore: number;
  teleopBottomShots: number;
  teleopInnerScore: number;
  teleopOuterScore: number;
  teleopUpperTotalShots: number;
  trenchRotate: boolean;
  trenchStop: boolean;
  teleopUpperShots: Array<TeleopUpperShot> = [];

  // End Game
  climbLocation: string;
  climbStatus: string;
  climbFailureReason: string;
}

export class ProcessedGames {
  gamesPlayed = 0;
  gamesWon = 0;
  gamesVector: Array<string> = [];
  gamesScoresVector: Array<number> = [];
  avgGameScore = 0;
  predictedGameScore: number;
  autoAVGInner = 0;
  autoAVGOuter = 0;
  autoAVGBottom = 0;
  autoAVG = 0;
  autoAVGTrenchCollect = 0;
  autoAVGClimbCollect = 0;
  autoAVGPowerCellsEndOfAuto = 0;
  autoAVGTotalCollect = 0;
  teleopAVGOuter = 0;
  teleopAVGInner = 0;
  teleopAVGBottom  = 0;
  teleopAVG = 0;
  teleopUpperTotalShot = 0;
  teleopBottomTotalShot = 0;
  teleopTotalShot = 0;
  teleopUpperSuccess = 0;
  teleopBottomSuccess = 0;
  teleopTotalSuccess = 0;
  teleopInnerOuterRatio;
  teleopTrenchRotate = 0;
  teleopTrenchStop = 0;
  teleopCyclesAVG = 0;
  climbSuccessfully = 0;
  climbAttempts = 0;
  climbSuccess = 0;
  climbLocationsAVG = 0;
  totalGamePieces = 0;
  autoTotalShoot = 0;
  totalShoots = 0;
  totalSuccessPercent = 0;

  autoBottomScoreVector: Array<number> = [];
  autoBottomScorePctVector: Array<number> = [];
  autoInnerScoreVector: Array<number> = [];
  autoOuterScoreVector: Array<number> = [];
  autoUpperScoreVector: Array<number> = [];
  autoUpperScorePctVector: Array<number> = [];
  autoTotalScoreVector: Array<number> = [];
  autoTotalScorePctVector: Array<number> = [];

  teleopInnerScoreVector: Array<number> = [];
  teleopOuterScoreVector: Array<number> = [];
  teleopBottomScoreVector: Array<number> = [];
  teleopCyclesVector: Array<number> = [];
  climbLocations: Array<number> = [];
  teleopDetailedScores: Array<[string, number, number]>;
}
@Injectable({
  providedIn: 'root'
})
export class GameService {
  games: Array<Game>;

  constructor(private db: AngularFirestore) { }

  getGames(tournament: string, teamNumber: string) {
    return this.db.collection('tournaments').doc(tournament).collection('teams').doc(teamNumber).collection('games').snapshotChanges()
      .pipe(map(arr => {
        return arr.map(snap => {
          const data = snap.payload.doc.data();
          const gameNumber = snap.payload.doc.id;
          const game: Game = new Game();
          game.gameNumber = gameNumber;
          game.color = data['Game scouting'].allianceColor;
          game.startingPosition = data['Game scouting'].PreGame.startingPosition;
          game.gameWon = data['Game scouting'].gameWon;

          // Auto
          game.autoPowerCellsOnAutoEnd = data['Game scouting'].Auto.autoPowerCellsOnRobotEndOfAuto;
          game.autoBottomScore = data['Game scouting'].Auto.bottomScore;
          game.autoBottomShots = data['Game scouting'].Auto.bottomShoot;
          game.climbBallCollected1 = data['Game scouting'].Auto.climb1BallCollected;
          game.climbBallCollected2 = data['Game scouting'].Auto.climb2BallCollected;
          game.climbBallCollected3 = data['Game scouting'].Auto.climb3BallCollected;
          game.climbBallCollected4 = data['Game scouting'].Auto.climb4BallCollected;
          game.climbBallCollected5 = data['Game scouting'].Auto.climb5BallCollected;
          game.autoClimbCollect.push(game.climbBallCollected1);
          game.autoClimbCollect.push(game.climbBallCollected2);
          game.autoClimbCollect.push(game.climbBallCollected3);
          game.autoClimbCollect.push(game.climbBallCollected4);
          game.autoClimbCollect.push(game.climbBallCollected5);
          game.autoInnerScore = data['Game scouting'].Auto.innerScore;
          game.autoOuterScore = data['Game scouting'].Auto.outerScore;
          game.trenchBallCollected1 = data['Game scouting'].Auto.trench1BallCollected;
          game.trenchBallCollected2 = data['Game scouting'].Auto.trench2BallCollected;
          game.trenchBallCollected3 = data['Game scouting'].Auto.trench3BallCollected;
          game.trenchBallCollected4 = data['Game scouting'].Auto.trench4BallCollected;
          game.trenchBallCollected5 = data['Game scouting'].Auto.trench5BallCollected;
          game.autoTrenchCollect.push(game.trenchBallCollected1);
          game.autoTrenchCollect.push(game.trenchBallCollected2);
          game.autoTrenchCollect.push(game.trenchBallCollected3);
          game.autoTrenchCollect.push(game.trenchBallCollected4);
          game.autoTrenchCollect.push(game.trenchBallCollected5);
          game.autoUpperTotalShots = data['Game scouting'].Auto.upperShoot;
          const shots = data['Game scouting'].Auto.upperData;
          shots.forEach(shot => {
            const s = new AutoUpperShot();
            s.innerScore = shot.innerScore;
            s.outerScore = shot.outerScore;
            s.shots = shot.shoot;
            game.autoUpperShots.push(s);
          });

          // Teleop
          game.teleopBottomScore = data['Game scouting'].Teleop.Sum.bottomScore;
          game.teleopBottomShots = data['Game scouting'].Teleop.Sum.bottomShoot;
          game.teleopInnerScore = data['Game scouting'].Teleop.Sum.innerScore;
          game.teleopOuterScore = data['Game scouting'].Teleop.Sum.outerScore;
          game.trenchRotate = data['Game scouting'].Teleop.Sum.trenchRotate;
          game.trenchStop = data['Game scouting'].Teleop.Sum.trenchStop;
          game.teleopUpperTotalShots = data['Game scouting'].Teleop.Sum.upperShoot;
          const teleopShots = data['Game scouting'].Teleop.upperData;
          teleopShots.forEach(shot => {
            const s = new TeleopUpperShot();
            s.innerScore = shot.innerScore;
            s.outerScore = shot.outerScore;
            s.shots = shot.shoot;
            s.x = shot.x;
            s.y = shot.y;
            game.teleopUpperShots.push(s);
          });

          // End Game
          game.climbLocation = data['Game scouting'].EndGame.climbLocation;
          game.climbStatus = data['Game scouting'].EndGame.climbStatus;
          game.climbFailureReason = data['Game scouting'].EndGame.whyDidntClimb;
          return game;
        });
      }));
  }

  processGames(games: Array<Game>) {
    const processedGames: ProcessedGames = new ProcessedGames();
    processedGames.gamesPlayed = games.length;
    processedGames.teleopDetailedScores = [];
    games.forEach(game => {
      game.autoTrenchCollect.forEach(collect => {
        if (collect) {
          processedGames.autoAVGTrenchCollect += 1;
        }
      });
      game.autoClimbCollect.forEach(collect => {
        if (collect) {
          processedGames.autoAVGClimbCollect += 1;
        }
      });
      if (game.trenchRotate) {
        processedGames.teleopTrenchRotate += 1;
      }
      if (game.trenchStop) {
        processedGames.teleopTrenchStop += 1;
      }
      // tslint:disable-next-line:triple-equals
      if (game.climbStatus == 'טיפס בהצלחה') {
        processedGames.climbSuccessfully += 1;
        processedGames.climbAttempts += 1;
        processedGames.climbLocations.push(Number(game.climbLocation));
      }
      // tslint:disable-next-line:triple-equals
      if (game.climbStatus == 'ניסה ולא הצליח') {
        processedGames.climbAttempts += 1;
      }
      processedGames.gamesVector.push(game.gameNumber);
      processedGames.gamesWon += game.gameWon ? 1 : 0;
      const gameScore = this.calcGameScore(game);
      processedGames.gamesScoresVector.push(gameScore);
      processedGames.autoAVGPowerCellsEndOfAuto += game.autoPowerCellsOnAutoEnd;
      processedGames.avgGameScore += gameScore;
      processedGames.autoBottomScoreVector.push(game.autoBottomScore);
      processedGames.autoBottomScorePctVector.push(game.autoBottomScore / game.autoBottomShots * 100);
      processedGames.autoInnerScoreVector.push(game.autoInnerScore);
      processedGames.teleopInnerScoreVector.push(game.teleopInnerScore);
      processedGames.teleopOuterScoreVector.push(game.teleopOuterScore);
      processedGames.teleopCyclesVector.push(game.teleopUpperShots.length);
      processedGames.teleopBottomScoreVector.push(game.teleopBottomScore);
      processedGames.autoOuterScoreVector.push(game.autoOuterScore);
      processedGames.autoUpperScoreVector.push(game.autoInnerScore + game.autoOuterScore);
      processedGames.autoUpperScorePctVector.push((game.autoInnerScore + game.autoOuterScore) / game.autoUpperTotalShots * 100);
      processedGames.autoTotalScoreVector.push(game.autoInnerScore + game.autoOuterScore + game.autoBottomScore);
      processedGames.autoTotalScorePctVector.push((game.autoInnerScore + game.autoOuterScore + game.autoBottomScore) /
        (game.autoUpperTotalShots + game.autoBottomShots) * 100);
      processedGames.autoAVGInner += game.autoInnerScore;
      processedGames.autoAVGOuter += + game.autoOuterScore;
      processedGames.teleopAVGOuter += game.teleopOuterScore;
      processedGames.teleopAVGInner += game.teleopInnerScore;
      processedGames.teleopAVGBottom += game.teleopBottomScore;
      processedGames.autoAVGBottom += game.autoBottomScore;
      processedGames.teleopCyclesAVG += game.teleopUpperShots.length;
      // @ts-ignore
      processedGames.teleopUpperTotalShot += game.teleopUpperTotalShots;
      processedGames.teleopBottomTotalShot += game.teleopBottomShots;
      processedGames.teleopTotalShot += game.teleopUpperTotalShots + game.teleopBottomShots;
      processedGames.autoTotalShoot += game.autoUpperTotalShots + game.autoBottomShots;
      game.teleopUpperShots.forEach(shot => {
        processedGames.teleopDetailedScores.push(['', shot.x, shot.y]);
      });
    });
    processedGames.climbLocations.forEach(location => {
      processedGames.climbLocationsAVG += location;
    });
    // tslint:disable-next-line:max-line-length
    processedGames.totalGamePieces = processedGames.autoAVGOuter + processedGames.autoAVGInner + processedGames.autoAVGBottom + processedGames.teleopAVGOuter + processedGames.teleopAVGInner + processedGames.teleopAVGBottom;
    processedGames.totalShoots = processedGames.teleopTotalShot + processedGames.autoTotalShoot;
    processedGames.avgGameScore = processedGames.avgGameScore / processedGames.gamesPlayed;
    processedGames.climbLocationsAVG = Math.round(processedGames.climbLocationsAVG / processedGames.climbSuccessfully);
    const gamesScoreLine = this.calc1dRegression(processedGames.gamesScoresVector);
    // tslint:disable-next-line:max-line-length
    processedGames.teleopUpperSuccess = Math.round(((processedGames.teleopAVGOuter + processedGames.teleopAVGInner) / processedGames.teleopUpperTotalShot) * 100);
    processedGames.teleopBottomSuccess = Math.round(((processedGames.teleopAVGBottom) / processedGames.teleopBottomTotalShot) * 100);
    // tslint:disable-next-line:max-line-length
    processedGames.teleopTotalSuccess = Math.round(((processedGames.teleopAVGBottom + processedGames.teleopAVGOuter + processedGames.teleopAVGInner) / (processedGames.teleopBottomTotalShot + processedGames.teleopUpperTotalShot)) * 100);
    processedGames.teleopInnerOuterRatio = processedGames.teleopAVGInner + '/' + processedGames.teleopAVGOuter;
    processedGames.predictedGameScore = gamesScoreLine.m * games.length + gamesScoreLine.n;
    processedGames.autoAVGInner = processedGames.autoAVGInner / games.length;
    processedGames.autoAVGOuter = processedGames.autoAVGOuter / games.length;
    processedGames.autoAVGBottom = processedGames.autoAVGBottom / games.length;
    processedGames.teleopAVGBottom = processedGames.teleopAVGBottom / games.length;
    processedGames.teleopAVGInner = processedGames.teleopAVGInner / games.length;
    processedGames.teleopAVGOuter = processedGames.teleopAVGOuter / games.length;
    processedGames.autoAVGTrenchCollect = processedGames.autoAVGTrenchCollect / games.length;
    processedGames.autoAVGClimbCollect = processedGames.autoAVGClimbCollect / games.length;
    processedGames.autoAVGPowerCellsEndOfAuto = processedGames.autoAVGPowerCellsEndOfAuto / games.length;
    processedGames.teleopAVG = processedGames.teleopAVGBottom + processedGames.teleopAVGInner + processedGames.teleopAVGOuter;
    processedGames.autoAVG = processedGames.autoAVGInner + processedGames.autoAVGOuter + processedGames.autoAVGBottom;
    processedGames.teleopCyclesAVG = processedGames.teleopCyclesAVG / games.length;
    processedGames.autoAVGTotalCollect = processedGames.autoAVGTrenchCollect + processedGames.autoAVGClimbCollect;
    processedGames.climbSuccess = (processedGames.climbSuccessfully / processedGames.climbAttempts) * 100;
    processedGames.totalSuccessPercent = Math.round((processedGames.totalGamePieces / processedGames.totalShoots) * 100);
    return processedGames;
  }

  calcGameScore(game: Game) {
    return game.teleopBottomScore + 2 * game.teleopOuterScore + 3 * game.teleopInnerScore +
      2 * game.autoBottomScore + 4 * game.autoOuterScore + 6 * game.autoInnerScore;
  }

  calcRegression(xVector: Array<number>, yVector: Array<number>): LineCoeffs {
    const result: LineCoeffs = new LineCoeffs();

    let mx = 0; let my = 0;
    let sx = 0; let sy = 0;
    let n = 0;
    let  sx2 = 0;
    xVector.forEach(x => {
      n += 1;
      sx += x;
      sx2 += x * x;
    });
    yVector.forEach(y => {
      sy += y;
    });
    mx = sx / n;
    my = sy / n;

    let nominator = 0;
    for (let i = 0; i < xVector.length; i++) {
      nominator += (xVector[i] - mx) * (yVector[i] - my);
    }
    result.m = nominator / sx2;
    result.n = my - result.m * mx;
    return result;
  }

  calc1dRegression(yVector: Array<number>): LineCoeffs {
    const result: LineCoeffs = new LineCoeffs();

    let mx = 0; let my = 0;
    let sx = 0; let sy = 0;
    let n = 0;
    let  sx2 = 0;
    for (let i = 0; i < yVector.length; i++) {
      n += 1;
      sx += i + 1;
      sx2 += (i + 1) * (i + 1);
      sy += yVector[i];

    }
    mx = sx / n;
    my = sy / n;

    let nominator = 0;
    for (let i = 0; i < yVector.length; i++) {
      nominator += (i + 1 - mx) * (yVector[i] - my);
    }
    result.m = nominator / sx2;
    result.n = my - result.m * mx;
    return result;
  }

}