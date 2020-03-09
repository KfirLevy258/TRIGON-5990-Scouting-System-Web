import {Component, OnInit, ViewChild} from '@angular/core';
import {Ranking, RankingService} from '../ranking.service';
import {MatTable} from '@angular/material';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  ranking: Ranking[];
  displayedColumns: string[] = ['teamNumber', 'RP', 'predictedRP'];
  @ViewChild('rankingTable', {static: true}) rankingTable: MatTable<Ranking>;

  constructor(private rankingService: RankingService) { }

  ngOnInit() {

    const tournament = localStorage.getItem('tournament');

    this.rankingService.getRanking(tournament)
      .then(ranking => {
        this.ranking = ranking;
      });
  }

  rankingSort(event) {
    console.log(event);
    if (event.active === 'RP') {
      if  (event.direction === 'asc') {
        this.ranking.sort((r1, r2) => r1.RP < r2.RP ? -1 : 1);
      } else {
        this.ranking.sort((r1, r2) => r1.RP < r2.RP ? 1 : -1);
      }
    } else {
      if  (event.direction === 'asc') {
        this.ranking.sort((r1, r2) => r1.predictedRP < r2.predictedRP ? -1 : 1);
      } else {
        this.ranking.sort((r1, r2) => r1.predictedRP < r2.predictedRP ? 1 : -1);
      }
    }
    this.rankingTable.renderRows();
  }

}
