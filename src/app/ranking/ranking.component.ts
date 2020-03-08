import { Component, OnInit } from '@angular/core';
import {Ranking, RankingService} from '../ranking.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  ranking$: Observable<Ranking[]>;
  displayedColumns: string[] = ['teamNumber', 'RP', 'predictedRP'];

  constructor(private rankingService: RankingService) { }

  ngOnInit() {

    const tournament = localStorage.getItem('tournament');

    this.ranking$ = this.rankingService.getRanking$(tournament);
  }

}
