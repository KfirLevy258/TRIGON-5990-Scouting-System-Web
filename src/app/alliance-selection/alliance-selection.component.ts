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

  selectedTournament: string;
  teams: Observable<Team[]>;
  processedTeamsGames: Array<{team_number: string, team_processed_games: ProcessedGames}> = [];
  auto3BallsWeight = 0.1;
  auto10BallsWeight = 0.65;
  autoCollectWeight = 0.25;
  autoBallsAmount = 10;
  teleopBallsWeight = 1;
  teleopBallsAmount = 30;


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
              // this.processedTeamsGames.push({team_number: team.teamNumber, team_processed_games: this.gameService.processGames(games)});
              this.getFirstPickTeamScore(this.gameService.processGames(games), team.teamNumber);
            });
        }
      );
    });
  }

  getFirstPickTeamScore(processedGames: ProcessedGames, teamNumber: string) {
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
    endGameScore += 3;


    totalScore = autoScore + teleopScore + endGameScore;
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
