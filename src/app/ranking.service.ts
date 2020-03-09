import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {take} from 'rxjs/operators';

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

  getRanking(tournament: string): Promise<Array<Ranking>> {
    const result: Array<Ranking> = new Array<Ranking>();
    return new Promise<Array<Ranking>>((resolve => {
      this.db.collection('tournaments').doc(tournament).collection('teams').get()
        .pipe(take(1))
        .subscribe(teams => {
          teams.docs.forEach(team => {
            const r = new Ranking(team.id);
            r.RP = this.calcRP(team.id);
            r.predictedRP = this.calcPredictedRP(team.id);
            result.push(r);
          });
          resolve(result);
        });
    }));
  }

  calcRP(teamNumber: string): number {
    return Number(teamNumber.substring(0,  1));
  }

  calcPredictedRP(teamNumber: string): number {
    return Number(teamNumber.substring(1,  2));
  }
}
