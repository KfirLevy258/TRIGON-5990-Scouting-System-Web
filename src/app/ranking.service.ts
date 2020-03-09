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
            const r = new Ranking( team.id);
            this.calcRP(tournament, team.id)
              .then(rp => {
                r.RP = rp;
              });
            r.predictedRP = this.calcPredictedRP(team.id);
            result.push(r);
          });
          resolve(result);
        });
    }));
  }

  calcRP(tournament: string, teamNumber: string): Promise<number> {
    return new Promise<number>((resolve) => {
      this.db.collection('tournaments').doc(tournament).collection('teams').doc(teamNumber).collection('games').get()
        .pipe(take(1))
        .subscribe(games => {
          let rp = 0;
          games.docs.forEach(game => {
            if (game.data()['Game scouting'].gameWon) {
              rp += 2;
            }
            if (game.data()['Game scouting'].climbRP) {
              rp += 1;
            }
            if (game.data()['Game scouting'].ballsRP) {
              rp += 1;
            }
          });
          resolve(games.size !== 0 ? rp / games.size : 0);
        });
    });

  }

  calcPredictedRP(teamNumber: string): number {
    return Number(teamNumber.substring(1,  2));
  }
}
