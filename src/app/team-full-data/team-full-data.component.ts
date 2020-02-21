import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {Game, GameService, ProcessedGames, Team} from '../game.service';

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
              private gameService: GameService) { }

  ngOnInit() {
    this.selectedTournament = localStorage.getItem('tournament');

    this.teams = this.gameService.getTeams$(this.selectedTournament);

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
