import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Game, GameService, ProcessedGames} from '../game.service';
import {Observable} from 'rxjs';
import {ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';

@Component({
  selector: 'app-team-game-scouting-summary',
  templateUrl: './team-game-scouting-summary.component.html',
  styleUrls: ['./team-game-scouting-summary.component.scss']
})
export class TeamGameScoutingSummaryComponent implements OnInit, OnChanges {
  @Input() tournament;
  @Input() teamNumber;

  games$: Observable<Game[]>;
  games: Array<Game> = [];
  processedGames: ProcessedGames;


  constructor(private gameService: GameService) { }

  gamesScoreData: ChartDataSets[] = [];
  gamesLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
        }
      }]
    }
  };
  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];
  outerLineColor: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.28)',
    },
  ];
  innerLineColor: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(0,158,255,0.28)',
    },
  ];
  bottomLineColor: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(0,255,00,0.28)',
    },
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges): void {
    this.games$ = this.gameService.getGames(this.tournament, this.teamNumber);
    this.games$
      .subscribe(res => {
        this.gamesScoreData = [];

        this.games = res;
        this.processedGames = this.gameService.processGames(res);
        this.gamesLabels = this.processedGames.gamesVector;
        this.gamesScoreData.push({ data: this.processedGames.gamesScoresVector, label: 'Games Scores' });
      });
  }

}
