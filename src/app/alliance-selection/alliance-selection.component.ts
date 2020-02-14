import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Game, GameService, ProcessedGames} from '../game.service';

export class RankingItem {
  // tslint:disable-next-line:variable-name max-line-length
  constructor(private team_number: string, public score: {autoTotalScore: number, teleopTotalScore: number, endGameTotalScore: number, totalTotalScore: number}) {
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
  teams: Observable<Team[]>;
  rankingList: Array<RankingItem> = [];
  tempList: Array<RankingItem> = [];
  auto3BallsWeight = 0.1;
  auto10BallsWeight = 0.65;
  autoCollectWeight = 0.25;
  autoBallsAmount = 10;
  teleopBallsWeight = 1;
  teleopBallsAmount = 30;
  endGamesClimbSuccesses = 1;
  autoWeight = 0.15;
  teleopWeight = 0.6;
  endGameWeight = 0.25;
  isLoading = true;


  constructor(private db: AngularFirestore,
              private gameService: GameService,
              private changeRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.selectedTournament = localStorage.getItem('tournament');

    this.teams = this.db.collection('tournaments').doc(this.selectedTournament).collection('teams').snapshotChanges()
      .pipe(map(arr => {
        return  arr.map(snap => {
          const data = snap.payload.doc.data();
          const teamNumber = snap.payload.doc.id;
          return {teamNumber, ... data} as Team;
        });
      }));
    this.teams.subscribe(result => {
      const  promises: Array<Promise<Game[]>> = [];
      result.forEach((team: Team) => {
        // tslint:disable-next-line:max-line-length
        const teamRankingItem = new  RankingItem(team.teamNumber, {autoTotalScore: 0, teleopTotalScore: 0, endGameTotalScore: 0, totalTotalScore: 0});
        this.tempList.push(teamRankingItem);
        promises.push(this.gameService.getGamesPromise(this.selectedTournament, team.teamNumber));
        });
      Promise.all(promises)
        .then(res => {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < promises.length; i++) {
            this.tempList[i].score =  this.getFirstPickTeamScore(this.gameService.processGames(res[i]));
          }
          this.rankingList = this.tempList.sort((a, b) => {
            if (a.score.totalTotalScore < b.score.totalTotalScore) {
              return 1;
            }
            if (a.score.totalTotalScore > b.score.totalTotalScore) {
              return -1;
            }
            return 0;
          });
        });
      this.rankingList.sort((a, b) => {
        if (a.score.totalTotalScore > b.score.totalTotalScore) {
          return 1;
        }
        if (a.score.totalTotalScore < b.score.totalTotalScore) {
          return -1;
        }
        return 0;
      });
      this.isLoading = false;
    });
  }


  getFirstPickTeamScore(processedGames: ProcessedGames) {
    let totalScore;
    let autoScore;
    let teleopScore;
    let endGameScore;
    totalScore = 0;
    autoScore = 0;
    teleopScore = 0;
    endGameScore = 0;

    // Auto
    if ((processedGames.autoAVGOuter + processedGames.autoAVGInner) <= 3 ) {
      autoScore += (this.auto3BallsWeight / 3.0) * (processedGames.autoAVGOuter + processedGames.autoAVGInner);
    }
    if ((processedGames.autoAVGOuter + processedGames.autoAVGInner) > 3) {
      autoScore += this.auto3BallsWeight;
      autoScore += (this.auto10BallsWeight / this.autoBallsAmount) * ((processedGames.autoAVGOuter + processedGames.autoAVGInner) - 3);
    }
    autoScore += (this.autoCollectWeight / this.autoBallsAmount ) * processedGames.autoAVGTotalCollect;

    // Teleop
    teleopScore += ( this.teleopBallsWeight / this.teleopBallsAmount ) * (processedGames.teleopAVGInner + processedGames.teleopAVGOuter);

    // End Game
    endGameScore += this.endGamesClimbSuccesses * (processedGames.climbSuccess / 100);

    totalScore = this.autoWeight * autoScore + this.teleopWeight * teleopScore + this.endGameWeight * endGameScore;
    return {autoTotalScore: autoScore, teleopTotalScore: teleopScore, endGameTotalScore: endGameScore, totalTotalScore: totalScore};
  }

  onTeamSelected(element: RankingItem) {
    console.log(element);
    console.log(this.rankingList.indexOf(element));
    this.rankingList.splice(this.rankingList.indexOf(element), 1);
    console.log(this.rankingList);
    this.changeRef.detectChanges();
  }
}

class Team {
  teamNumber: string;
  // tslint:disable-next-line:variable-name
  team_name: string;
  // tslint:disable-next-line:variable-name
  pit_scouting_saved: boolean;

  constructor(iTeamNumber: string, iTeamName: string) {
    this.teamNumber =  iTeamNumber;
    this.team_name = iTeamName;
  }

}
