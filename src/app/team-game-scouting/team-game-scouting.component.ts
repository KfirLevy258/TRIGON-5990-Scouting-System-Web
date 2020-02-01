import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Game, GameService, ProcessedGames} from '../game.service';
import {Observable} from 'rxjs';
import {GoogleChartComponent} from 'angular-google-charts';

@Component({
  selector: 'app-team-game-scouting',
  templateUrl: './team-game-scouting.component.html',
  styleUrls: ['./team-game-scouting.component.scss']
})
export class TeamGameScoutingComponent implements OnInit {
  @Input() tournament;
  @Input() teamNumber;

  games$: Observable<Game[]>;
  games: Array<Game> = [];
  processedGames: ProcessedGames;

  columnNames = ['game Number', 'Score'];
  options = {
  };
  width = 400;
  height = 300;

  data = [
    ['a', 1, 2]
  ];

  columnNames2 = ['a', 'b', 'c'];
  constructor(private gameService: GameService) { }

  ngOnInit() {

    this.games$ = this.gameService.getGames(this.tournament, this.teamNumber);
    this.games$
      .subscribe(res => {
        this.games = res;
        console.log(res);
        this.processedGames = this.gameService.processGames(res);
      });
  }

}
