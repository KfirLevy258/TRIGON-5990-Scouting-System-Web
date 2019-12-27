import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

class Team {
  teamNumber: string;
  team_name: string;
  pit_scouting_saved: boolean;
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  selectedTournament: string;
  selectedTeamNumber;
  selectedTeam: Team;
  tournaments: Observable<any[]>;
  teams: Observable<Team[]>;


  constructor(private db: AngularFirestore) { }

  ngOnInit() {


    this.tournaments = this.db.collection('tournaments').snapshotChanges()
      .pipe(map(arr => {
        return arr.map(snap => {
          return snap.payload.doc.id;
        });
      }));

  }

  tournamentSelect(tournament) {
    this.selectedTournament = tournament;
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
    this.selectedTeam = team;
  }
}
