import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {Game, GameService, ProcessedGames, Team} from '../game.service';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './team-full-data.component.html',
  styleUrls: ['./team-full-data.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class TeamFullData implements OnInit {

  selectedTournament: string;
  selectedTeamNumber;
  selectedTeamName: string;
  selectedTeam;
  selectedTeamArray: Array<string>;
  teams: Observable<Team[]>;

  games: Array<Game> = [];
  processedGames: ProcessedGames;

  constructor(private db: AngularFirestore,
              private route: ActivatedRoute,
              private gameService: GameService) { }

  ngOnInit() {
    this.selectedTournament = localStorage.getItem('tournament');

    this.teams = this.gameService.getTeams$(this.selectedTournament);

    this.route.params
      .pipe(take(1))
      .subscribe(params => {
        if (params.teamNumber !== '0') {
          this.db.collection('tournaments').doc(this.selectedTournament).collection('teams').doc(params.teamNumber).get()
            .pipe(take(1))
            .subscribe(teamData => {
              const team = new Team(params.teamNumber, teamData.data().team_name);
              console.log(teamData.data());
              this.teamSelect(team);
            });

        }
      });
  }

  teamSelect(team: Team) {
    this.selectedTeamNumber = team.teamNumber;
    this.selectedTeamName = team.team_name;
    this.selectedTeam = team;
    this.selectedTeamArray = [team.teamNumber];
    localStorage.setItem('teamNumber', team.teamNumber);
    localStorage.setItem('teamName', team.team_name);
    this.gameService.getGames(this.selectedTournament, this.selectedTeamNumber)
      .subscribe(res => {
        this.games = res;
        this.processedGames = this.gameService.processGames(res);
      });

  }
}
