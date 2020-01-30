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
  templateUrl: './full-team-data.component.html',
  styleUrls: ['./full-team-data.component.scss']
})
export class FullTeamDataComponent implements OnInit {

  selectedTournament: string;
  selectedTeamNumber;
  selectedTeamName: string;
  selectedTeam;
  teams: Observable<Team[]>;


  constructor(private db: AngularFirestore) { }

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
  }

  teamSelect(team: Team) {
    this.selectedTeamNumber = team.teamNumber;
    this.selectedTeamName = team.team_name;
    this.selectedTeam = team;
    localStorage.setItem('teamNumber', team.teamNumber);
    localStorage.setItem('teamName', team.team_name);
  }
}
