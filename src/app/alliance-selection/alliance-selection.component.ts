import {Component, OnInit} from '@angular/core';
import {take} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Game, GameService, ProcessedGames, Team} from '../game.service';
import {MatCheckboxChange, MatDialog} from '@angular/material';
import {defaultDialogConfig} from '../default-dialog-config';
import {
  Alliance1stScoreParametersDialogComponent
} from '../alliance1st-score-dialog-parameters/alliance1st-score-parameters-dialog.component';
import {FirstScoreParameters, SecondScoreParameters} from '../alliance-score-parameters';
import {Alliance2ndScoreParametersDialogComponent
} from '../alliance2nd-score-parameters-dialog/alliance2nd-score-parameters-dialog.component';
import * as cloneDeep from 'lodash/cloneDeep';

class Score {
  autoScore: number;
  teleopScore: number;
  endGameScore: number;
  totalScore: number;

  constructor() {
    this.autoScore = 0;
    this.teleopScore = 0;
    this.endGameScore = 0;
    this.totalScore = 0;
  }
}


export class RankingItem {
  constructor(public selected: boolean, public teamNumber: string, public score: Score) {
  }
}
@Component({
  selector: 'app-alliance-selection',
  templateUrl: './alliance-selection.component.html',
  styleUrls: ['./alliance-selection.component.scss']
})
export class AllianceSelectionComponent implements OnInit {
  displayedColumns: string[] = ['select', 'Actions', 'team_number', 'auto_score', 'teleop_score', 'end_game_score', 'score'];
  selectedTournament: string;
  teams: Array<Team> = [];
  firstRankingList: Array<RankingItem> = [];
  firstScoreParameters: FirstScoreParameters = {
    auto3BallsWeight: 0.1,
    auto10BallsWeight: 0.65,
    autoCollectWeight: 0.25,
    autoBallsAmount: 10,
    teleopBallsWeight: 1,
    teleopBallsAmount: 30,
    endGamesClimbSuccesses: 1,
    autoWeight: 0.15,
    teleopWeight: 0.6,
    endGameWeight: 0.25,
  };
  secondRankingList: Array<RankingItem> = [];
  secondScoreParameters: SecondScoreParameters = {
    auto3BallsWeight: 0.1,
    auto10BallsWeight: 0.65,
    autoCollectWeight: 0.25,
    autoBallsAmount: 10,
    teleopRouletteWeight: 0.6,
    teleopBallsWeight: 0.4,
    teleopBallsAmount: 30,
    endGamesClimbSuccesses: 1,
    autoWeight: 0.3,
    teleopWeight: 0.3,
    endGameWeight: 0.4,
  };

  autoBallsTotal = 0;
  teleopBallsTotal = 0;
  teleopTrenchRevsTotal = 0;

  isLoading = true;


  constructor(private db: AngularFirestore,
              private gameService: GameService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.selectedTournament = localStorage.getItem('tournament');

    this.gameService.getTeams$(this.selectedTournament)
    .subscribe(result => {
      this.teams = result;
      // this.biggerScore();
      this.calcRankingLists();
      this.isLoading = false;
    });
  }
  calcRankingLists() {
    const temp1stList: Array<RankingItem> = [];
    const temp2ndList: Array<RankingItem> = [];

    const  promises: Array<Promise<Game[]>> = [];
    this.teams.forEach((team: Team) => {
      const team1stRankingItem = new  RankingItem(false, team.teamNumber, new Score());
      temp1stList.push(team1stRankingItem);
      const team2ndRankingItem = new  RankingItem(false, team.teamNumber, new Score());
      temp2ndList.push(team2ndRankingItem);
      promises.push(this.gameService.getGamesPromise(this.selectedTournament, team.teamNumber));
    });
    Promise.all(promises)
      .then(res => {
        this.autoBallsTotal = 0;
        this.teleopBallsTotal = 0;
        this.teleopTrenchRevsTotal = 0;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < promises.length; i++) {
          const processedGames = this.gameService.processGames(res[i]);
          if ((processedGames.autoAVGInner + processedGames.autoAVGOuter) > this.autoBallsTotal) {
            this.autoBallsTotal = (processedGames.autoAVGInner + processedGames.autoAVGOuter);
          }
          if ((processedGames.teleopAVGOuter + processedGames.teleopAVGInner) > this.teleopBallsTotal) {
            this.teleopBallsTotal = (processedGames.teleopAVGOuter + processedGames.teleopAVGInner);
          }
          // tslint:disable-next-line:max-line-length
          if (((processedGames.teleopTrenchRotate + processedGames.teleopTrenchStop) / processedGames.gamesPlayed) > this.teleopTrenchRevsTotal) {
            // tslint:disable-next-line:max-line-length
            this.teleopTrenchRevsTotal = ((processedGames.teleopTrenchRotate + processedGames.teleopTrenchStop) / processedGames.gamesPlayed);
          }
          temp1stList[i].score =  this.calc1stPickTeamScore(processedGames);
          temp2ndList[i].score =  this.calc2ndPickTeamScore(processedGames);
        }
        this.firstRankingList = temp1stList.sort(scoreSort);
        this.secondRankingList = temp2ndList.sort(scoreSort);
      });
  }

  calc1stPickTeamScore(processedGames: ProcessedGames): Score {
    const resultScore = new Score();

    // Auto
    if ((processedGames.autoAVGOuter + processedGames.autoAVGInner) <= 3 ) {
      resultScore.autoScore += (this.firstScoreParameters.auto3BallsWeight / 3.0) *
        (processedGames.autoAVGOuter + processedGames.autoAVGInner);
    }
    if ((processedGames.autoAVGOuter + processedGames.autoAVGInner) > 3) {
      resultScore.autoScore += this.firstScoreParameters.auto3BallsWeight;
      resultScore.autoScore += (this.firstScoreParameters.auto10BallsWeight / (this.autoBallsTotal - 3)) *
        ((processedGames.autoAVGOuter + processedGames.autoAVGInner) - 3);
    }
    resultScore.autoScore += (this.firstScoreParameters.autoCollectWeight / (this.autoBallsTotal) ) *
      processedGames.autoAVGTotalCollect;

    // Teleop
    resultScore.teleopScore += ( this.firstScoreParameters.teleopBallsWeight / this.teleopBallsTotal ) *
      (processedGames.teleopAVGInner + processedGames.teleopAVGOuter);

    // End Game
    resultScore.endGameScore += this.firstScoreParameters.endGamesClimbSuccesses * (processedGames.climbSuccess / 100);

    resultScore.totalScore = this.firstScoreParameters.autoWeight * resultScore.autoScore + this.firstScoreParameters.teleopWeight *
      resultScore.teleopScore + this.firstScoreParameters.endGameWeight * resultScore.endGameScore;
    return resultScore;
  }

  calc2ndPickTeamScore(processedGames: ProcessedGames): Score {
    const resultScore = new Score();

    // Auto
    if ((processedGames.autoAVGOuter + processedGames.autoAVGInner) <= 3 ) {
      resultScore.autoScore += (this.secondScoreParameters.auto3BallsWeight / 3.0) *
        (processedGames.autoAVGOuter + processedGames.autoAVGInner);
    }
    if ((processedGames.autoAVGOuter + processedGames.autoAVGInner) > 3) {
      resultScore.autoScore += this.secondScoreParameters.auto3BallsWeight;
      resultScore.autoScore += (this.secondScoreParameters.auto10BallsWeight / (this.autoBallsTotal - 3)) *
        ((processedGames.autoAVGOuter + processedGames.autoAVGInner) - 3);
    }
    resultScore.autoScore += (this.secondScoreParameters.autoCollectWeight / this.autoBallsTotal ) *
      processedGames.autoAVGTotalCollect;

    // Teleop
    resultScore.teleopScore += ( this.secondScoreParameters.teleopBallsWeight / this.teleopBallsTotal ) *
      (processedGames.teleopAVGInner + processedGames.teleopAVGOuter);
    resultScore.teleopScore += ( this.secondScoreParameters.teleopRouletteWeight / this.teleopTrenchRevsTotal) *
      ((processedGames.teleopTrenchRotate + processedGames.teleopTrenchStop) / processedGames.gamesPlayed);
    console.log(this.teleopTrenchRevsTotal);
    // End Game
    resultScore.endGameScore += this.secondScoreParameters.endGamesClimbSuccesses * (processedGames.climbSuccess / 100);

    resultScore.totalScore = this.secondScoreParameters.autoWeight * resultScore.autoScore + this.secondScoreParameters.teleopWeight *
      resultScore.teleopScore + this.secondScoreParameters.endGameWeight * resultScore.endGameScore;
    return resultScore;
  }

  open1stScoreDialog() {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: 'Teams 1st Score Pick Parameters',
      scoreParameters: this.firstScoreParameters
    };

    this.dialog.open(Alliance1stScoreParametersDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this.firstScoreParameters = res;
          this.calcRankingLists();
        }
      });
  }

  open2ndScoreDialog() {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: 'Teams 1st Score Pick Parameters',
      scoreParameters: this.secondScoreParameters
    };

    this.dialog.open(Alliance2ndScoreParametersDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this.secondScoreParameters = res;
          this.calcRankingLists();
        }
      });
  }

  select(event: MatCheckboxChange, element: RankingItem, picListNumber: number) {
    console.log(picListNumber);
    const teamNumber = element.teamNumber;
    const checked = event.checked;

    const index1st = this.firstRankingList.findIndex(x => x.teamNumber === teamNumber);
    const index2nd = this.secondRankingList.findIndex(x => x.teamNumber === teamNumber);
    this.firstRankingList[index1st].selected = checked;
    this.secondRankingList[index2nd].selected = checked;
  }

  swapDown(picListNumber: number, index: number) {
    if (index < this.firstRankingList.length - 1) {
      if (picListNumber === 1) {
        const temp: RankingItem = this.firstRankingList[index + 1];
        this.firstRankingList[index + 1] = this.firstRankingList[index];
        this.firstRankingList[index] = temp;
        this.firstRankingList = cloneDeep(this.firstRankingList);
      } else {
        const temp: RankingItem = this.secondRankingList[index + 1];
        this.secondRankingList[index + 1] = this.secondRankingList[index];
        this.secondRankingList[index] = temp;
        this.secondRankingList = cloneDeep(this.secondRankingList);
      }
    }
  }

  swapUp(picListNumber: number, index: number) {
    if (index > 0) {
      if (picListNumber === 1) {
        const temp: RankingItem = this.firstRankingList[index - 1];
        this.firstRankingList[index - 1] = this.firstRankingList[index];
        this.firstRankingList[index] = temp;
        this.firstRankingList = cloneDeep(this.firstRankingList);
      } else {
        const temp: RankingItem = this.secondRankingList[index - 1];
        this.secondRankingList[index - 1] = this.secondRankingList[index];
        this.secondRankingList[index] = temp;
        this.secondRankingList = cloneDeep(this.secondRankingList);
      }
    }
  }

}

const scoreSort = (a: RankingItem, b: RankingItem) => {
  if (a.score.totalScore < b.score.totalScore) {
    return 1;
  }
  if (a.score.totalScore > b.score.totalScore) {
    return -1;
  }
  return 0;
};
