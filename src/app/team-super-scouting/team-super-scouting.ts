import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import {createPerformWatchHost} from '@angular/compiler-cli/src/perform_watch';
import {AutoUpperShot, Game, TeleopUpperShot} from '../game.service';

@Component({
  selector: 'app-super-scouting-page',
  templateUrl: './team-super-scouting.html',
  styleUrls: ['./team-super-scouting.scss']
})
// tslint:disable-next-line:component-class-suffix
export class TeamSuperScouting implements OnInit, OnChanges {
  @Input() tournament;
  @Input() teamNumber;
  messages: Array<string>;
  games$: Observable<SuperGame[]>;
  games: Array<SuperGame> = [];

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    this.games$ = this.getData();
    this.games$.subscribe(res => {
        this.games = res;
        this.games.forEach(game => {
          this.messages.push(game.textMessage);
          console.log(this.messages);
        });
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getData();
  }

  getData() {
    // tslint:disable-next-line:max-line-length
    return this.db.collection('tournaments').doc(this.tournament).collection('teams').doc(this.teamNumber).collection('games').snapshotChanges()
      .pipe(map(arr => {
        return arr.map(snap => {
          const data = snap.payload.doc.data();
          const gameNumber = snap.payload.doc.id;
          const superGame: SuperGame = new SuperGame();
          superGame.gameNumber = gameNumber;
          superGame.textMessage = data['Super scouting'].message;
          console.log(data['Super scouting'].message);
          return superGame;
        });
      }));
  }
}

export class SuperGame {
  gameNumber: string;
  textMessage: string;
}
