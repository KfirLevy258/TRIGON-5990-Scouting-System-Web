import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';

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

  // preGame
  startingPosition: string;

  // Auto
  autoPowerCellsOnAutoEnd: number;
  autoBottomScore: number;
  autoBottomShots: number;
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
  gamesPlayed: number;
  teleopTotalUpperScore: number;
  teleopTotalUpperShots: number;
  teleopTotalUpperScores: Array<[string, number]>;
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

          // Auto
          game.autoPowerCellsOnAutoEnd = data['Game scouting'].Auto.autoPowerCellsOnRobotEndOfAuto;
          game.autoBottomScore = data['Game scouting'].Auto.bottomScore;
          game.autoBottomShots = data['Game scouting'].Auto.bottomShoot;
          game.climbBallCollected1 = data['Game scouting'].Auto.climb1BallCollected;
          game.climbBallCollected2 = data['Game scouting'].Auto.climb2BallCollected;
          game.climbBallCollected3 = data['Game scouting'].Auto.climb3BallCollected;
          game.climbBallCollected4 = data['Game scouting'].Auto.climb4BallCollected;
          game.climbBallCollected5 = data['Game scouting'].Auto.climb5BallCollected;
          game.autoInnerScore = data['Game scouting'].Auto.innerScore;
          game.autoOuterScore = data['Game scouting'].Auto.outerScore;
          game.trenchBallCollected1 = data['Game scouting'].Auto.trench1BallCollected;
          game.trenchBallCollected2 = data['Game scouting'].Auto.trench2BallCollected;
          game.trenchBallCollected3 = data['Game scouting'].Auto.trench3BallCollected;
          game.trenchBallCollected4 = data['Game scouting'].Auto.trench4BallCollected;
          game.trenchBallCollected5 = data['Game scouting'].Auto.trench5BallCollected;

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
          const teleShots = data['Game scouting'].Teleop.upperData;
          teleShots.forEach(shot => {
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

    processedGames.teleopTotalUpperScore = 0;
    processedGames.teleopTotalUpperShots = 0;
    processedGames.teleopTotalUpperScores = [];
    processedGames.teleopDetailedScores = [];
    games.forEach(game => {
      processedGames.teleopTotalUpperScore += game.teleopInnerScore + game.teleopOuterScore;
      processedGames.teleopTotalUpperScores.push([game.gameNumber, game.teleopInnerScore + game.teleopOuterScore]);
      processedGames.teleopTotalUpperShots += game.teleopUpperTotalShots;
      game.teleopUpperShots.forEach(shot => {
        processedGames.teleopDetailedScores.push(['', shot.x, shot.y]);
      });
    });

    return processedGames;
  }
}
