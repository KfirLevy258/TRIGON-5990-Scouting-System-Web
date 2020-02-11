import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Game, GameService, ProcessedGames} from '../game.service';

@Component({
  selector: 'app-alliance-selection',
  templateUrl: './alliance-selection.component.html',
  styleUrls: ['./alliance-selection.component.scss']
})
export class AllianceSelectionComponent implements OnInit {
  displayedColumns: string[] = ['team_number', 'score'];
  selectedTournament: string;
  teams: Observable<Team[]>;
  rankingList: Array<{team_number: string, score: number}> = [];
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
              private gameService: GameService) { }

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
      result.forEach((team: Team) => {
        this.gameService.getGames(this.selectedTournament, team.teamNumber)
            .subscribe(games => {
              // tslint:disable-next-line:max-line-length
              this.rankingList.push({team_number: team.teamNumber, score: this.getFirstPickTeamScore(this.gameService.processGames(games))});
            });
        }
      );
      console.log(this.rankingList);
      this.rankingList.sort((a, b) => {
        if (a.score > b.score) {
          return 1;
        }
        if (a.score < b.score) {
          return -1;
        }
        return 0;
      });
      this.isLoading = false;
      console.log(this.rankingList);
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
    return totalScore;
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
