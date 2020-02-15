import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {map, take} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Game, GameService, ProcessedGames} from '../game.service';
import {MatDialog} from '@angular/material';
import {defaultDialogConfig} from '../default-dialog-config';
import {
  AllianceScoreParametersDialogComponent,
  ScoreParameters
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
  rankingList: Array<RankingItem> = [];
  scoreParameters: ScoreParameters = {
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
      this.calcRankingList();
      this.isLoading = false;
    });
  }

  calcRankingList() {
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
        this.rankingList = tempList.sort(scoreSort);
      });
  }

  calcFirstPickTeamScore(processedGames: ProcessedGames): Score {
    const resultScore = new Score();

    // Auto
    if ((processedGames.autoAVGOuter + processedGames.autoAVGInner) <= 3 ) {
      resultScore.autoScore += (this.scoreParameters.auto3BallsWeight / 3.0) *
        (processedGames.autoAVGOuter + processedGames.autoAVGInner);
    }
    if ((processedGames.autoAVGOuter + processedGames.autoAVGInner) > 3) {
      resultScore.autoScore += this.scoreParameters.auto3BallsWeight;
      resultScore.autoScore += (this.scoreParameters.auto10BallsWeight / this.scoreParameters.autoBallsAmount) *
        ((processedGames.autoAVGOuter + processedGames.autoAVGInner) - 3);
    }
    resultScore.autoScore += (this.scoreParameters.autoCollectWeight / this.scoreParameters.autoBallsAmount ) *
      processedGames.autoAVGTotalCollect;

    // Teleop
    resultScore.teleopScore += ( this.scoreParameters.teleopBallsWeight / this.scoreParameters.teleopBallsAmount ) *
      (processedGames.teleopAVGInner + processedGames.teleopAVGOuter);

    // End Game
    resultScore.endGameScore += this.scoreParameters.endGamesClimbSuccesses * (processedGames.climbSuccess / 100);

    resultScore.totalScore = this.scoreParameters.autoWeight * resultScore.autoScore + this.scoreParameters.teleopWeight *
      resultScore.teleopScore + this.scoreParameters.endGameWeight * resultScore.endGameScore;
    return resultScore;
  }

  onTeamSelected(element: RankingItem) {
    console.log(element);
    console.log(this.rankingList.indexOf(element));
    this.rankingList.splice(this.rankingList.indexOf(element), 1);
    console.log(this.rankingList);
    this.changeRef.detectChanges();
  }

  openDialog() {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: 'Teams Score Parameters',
      scoreParameters: this.scoreParameters
    };

    this.dialog.open(AllianceScoreParametersDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        this.scoreParameters = res;
        this.calcRankingList();
        console.log(res);
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
