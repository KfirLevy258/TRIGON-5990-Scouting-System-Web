import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {Game, GameService, ProcessedGames} from '../game.service';
import {ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';

@Component({
  selector: 'app-team-game-scouting-end-game',
  templateUrl: './team-game-scouting-end-game.html',
  styleUrls: ['./team-game-scouting-end-game.scss']
})

// tslint:disable-next-line:component-class-suffix
export class TeamGameScoutingEndGame implements OnInit, OnChanges {

  @Input() tournament;
  @Input() teamNumber;

  games$: Observable<Game[]>;
  games: Array<Game> = [];
  processedGames: ProcessedGames;


  constructor(private gameService: GameService) { }

  climbLocations: ChartDataSets[] = [];
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

  teleopCyclesData: ChartDataSets[] = [];

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges): void {
    this.games$ = this.gameService.getGames(this.tournament, this.teamNumber);
    this.games$
      .subscribe(res => {
        this.climbLocations = [];
        this.teleopCyclesData = [];

        this.games = res;
        this.processedGames = this.gameService.processGames(res);
        this.gamesLabels = this.processedGames.gamesVector;
        this.climbLocations.push({ data: this.processedGames.climbLocations, label: 'Games Scores' });
      });
  }

}
