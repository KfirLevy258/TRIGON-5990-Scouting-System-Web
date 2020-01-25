import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

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

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  selectedTournament: string;
  selectedTeamNumber;
  selectedTeamName: string;
  selectedTeam;
  tournaments: Observable<any[]>;
  teams: Observable<Team[]>;


  constructor(private db: AngularFirestore) { }

  ngOnInit() {

    // this.selectedTournament = localStorage.getItem('tournament');
    // if (this.selectedTournament) {
    //   this.tournamentSelect(this.selectedTournament);
    // }
    // this.selectedTeamNumber = localStorage.getItem('teamNumber');
    // this.selectedTeamName = localStorage.getItem('teamName');
    // this.selectedTeam = new Team(this.selectedTeamNumber, this.selectedTeamName);

    this.tournaments = this.db.collection('tournaments').snapshotChanges()
      .pipe(map(arr => {
        return arr.map(snap => {
          return snap.payload.doc.id;
        });
      }));

  }

  tournamentSelect(tournament) {
    this.selectedTournament = tournament;
    localStorage.setItem('tournament', tournament);
    this.teams = this.db.collection('tournaments').doc(tournament).collection('teams').snapshotChanges()
      .pipe(map(arr => {
        return  arr.map(snap => {
          const data = snap.payload.doc.data();
          const teamNumber = snap.payload.doc.id;
          return {teamNumber, ... data} as Team;
        });
      }));
  }

  teamSelect(team: Team) {
    this.selectedTeamNumber = team.teamNumber;
    this.selectedTeamName = team.team_name;
    this.selectedTeam = team;
    localStorage.setItem('teamNumber', team.teamNumber);
    localStorage.setItem('teamName', team.team_name);
  }
}
