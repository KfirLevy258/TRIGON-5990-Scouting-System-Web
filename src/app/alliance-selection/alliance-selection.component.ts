import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {map, take} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Game, GameService, ProcessedGames} from '../game.service';
import {MatDialog} from '@angular/material';
import {defaultDialogConfig} from '../default-dialog-config';
import {
  AllianceScoreParametersDialogComponent,
  FirstScoreParameters, SecondScoreParameters
} from '../alliance-score-dialog-parameters/alliance-score-parameters-dialog.component';

class Team {

  constructor(public teamNumber: string, public  teamName: string) {
  }

}

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
  constructor(private teamNumber: string, public score: Score) {
  }
}
@Component({
  selector: 'app-alliance-selection',
  templateUrl: './alliance-selection.component.html',
  styleUrls: ['./alliance-selection.component.scss']
})
export class AllianceSelectionComponent implements OnInit {
  displayedColumns: string[] = ['select', 'team_number', 'auto_score', 'teleop_score', 'end_game_score', 'score'];
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
  biggerBallScore = 0;

  isLoading = true;


  constructor(private db: AngularFirestore,
              private gameService: GameService,
              private dialog: MatDialog,
              private changeRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.selectedTournament = localStorage.getItem('tournament');

    this.db.collection('tournaments').doc(this.selectedTournament).collection('teams').snapshotChanges()
      .pipe(map(arr => {
        return  arr.map(snap => {
          const data = snap.payload.doc.data();
          const teamNumber = snap.payload.doc.id;
          return {teamNumber, ... data} as Team;
        });
      }))
    .subscribe(result => {
      this.teams = result;
      // this.biggerScore();
      this.calcFirstRankingList();
      this.isLoading = false;
    });
  }

  // biggerScore() {
  //   this.teams.forEach((team: Team) => {
  //     // tslint:disable-next-line:max-line-length
  //     this.db.collection('tournaments').doc(this.selectedTournament).collection('teams').doc(team.teamNumber).collection('games').snapshotChanges()
  //       .pipe(map(arr => {
  //         return  arr.map(snap => {
  //           const data = snap.payload.doc.data();
  //           return ;
  //         });
  //       }))
  //       .subscribe(result => {
  //         console.log(this.gameService.processGames(result));
  //       });
  //     // this.gameService.processGames(this.selectedTournament, team.teamNumber);
  //   });
  // }

  calcFirstRankingList() {
    const tempList: Array<RankingItem> = [];

    const  promises: Array<Promise<Game[]>> = [];
    this.teams.forEach((team: Team) => {
      const teamRankingItem = new  RankingItem(team.teamNumber, new Score());
      tempList.push(teamRankingItem);
      promises.push(this.gameService.getGamesPromise(this.selectedTournament, team.teamNumber));
    });
    Promise.all(promises)
      .then(res => {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < promises.length; i++) {
          tempList[i].score =  this.calcFirstPickTeamScore(this.gameService.processGames(res[i]));
        }
        this.firstRankingList = tempList.sort(scoreSort);
      });
  }

  calcFirstPickTeamScore(processedGames: ProcessedGames): Score {
    const resultScore = new Score();

    // Auto
    if ((processedGames.autoAVGOuter + processedGames.autoAVGInner) <= 3 ) {
      resultScore.autoScore += (this.firstScoreParameters.auto3BallsWeight / 3.0) *
        (processedGames.autoAVGOuter + processedGames.autoAVGInner);
    }
    if ((processedGames.autoAVGOuter + processedGames.autoAVGInner) > 3) {
      resultScore.autoScore += this.firstScoreParameters.auto3BallsWeight;
      resultScore.autoScore += (this.firstScoreParameters.auto10BallsWeight / this.firstScoreParameters.autoBallsAmount) *
        ((processedGames.autoAVGOuter + processedGames.autoAVGInner) - 3);
    }
    resultScore.autoScore += (this.firstScoreParameters.autoCollectWeight / this.firstScoreParameters.autoBallsAmount ) *
      processedGames.autoAVGTotalCollect;

    // Teleop
    resultScore.teleopScore += ( this.firstScoreParameters.teleopBallsWeight / this.firstScoreParameters.teleopBallsAmount ) *
      (processedGames.teleopAVGInner + processedGames.teleopAVGOuter);

    // End Game
    resultScore.endGameScore += this.firstScoreParameters.endGamesClimbSuccesses * (processedGames.climbSuccess / 100);

    resultScore.totalScore = this.firstScoreParameters.autoWeight * resultScore.autoScore + this.firstScoreParameters.teleopWeight *
      resultScore.teleopScore + this.firstScoreParameters.endGameWeight * resultScore.endGameScore;
    return resultScore;
  }

  onTeamSelected(element: RankingItem) {
    console.log(element);
    console.log(this.firstRankingList.indexOf(element));
    this.firstRankingList.splice(this.firstRankingList.indexOf(element), 1);
    console.log(this.firstRankingList);
    this.changeRef.detectChanges();
  }

  openDialog() {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: 'Teams Score Parameters',
      scoreParameters: this.firstScoreParameters
    };

    this.dialog.open(AllianceScoreParametersDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        if (res) {
          this.firstScoreParameters = res;
          this.calcFirstRankingList();
        }
      });
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
