import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  selectedTournament: string;
  selectedTeam;
  tournaments: Observable<any[]>;
  teams: Observable<any[]>;

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
    this.teams = this.db.collection('tournaments').doc(tournament).collection('pitScouting').snapshotChanges()
      .pipe(map(arr => {
        return  arr.map(snap => {
          const data = snap.payload.doc.data();
          const teamNumber = snap.payload.doc.id;
          return {teamNumber, ... data};
        });
      }));
  }

  teamSelect(team) {
    this.selectedTeam = team;
    console.log(team);
  }
}
