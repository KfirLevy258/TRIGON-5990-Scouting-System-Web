import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

export class Ranking {
  RP: number;
  predictedRP: number;

  constructor(private teamNumber: string) {
    this.RP = 0;
    this.predictedRP = 0;
  }
}

@Injectable({
  providedIn: 'root'
})
export class RankingService {

  constructor(private db: AngularFirestore) { }

  getRanking$(tournament: string): Observable<Array<Ranking>> {
    const result: Array<Ranking> = new Array<Ranking>();
    return this.db.collection('tournaments').doc(tournament).collection('teams').get()
      .pipe(
        map(teams => {
          teams.docs.forEach(team => {
            result.push(new Ranking(team.id));
          });
          return result;
      }
      ));
  }
}
