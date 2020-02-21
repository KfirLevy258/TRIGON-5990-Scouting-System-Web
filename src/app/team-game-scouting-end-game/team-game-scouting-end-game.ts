import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Game, ProcessedGames} from '../game.service';
import {ChartDataSets, ChartType} from 'chart.js';
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

  @Input() games: Array<Game> = [];
  @Input() processedGames: ProcessedGames;


  constructor() { }

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
  lineChartType: ChartType = 'line';

  teleopCyclesData: ChartDataSets[] = [];

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges): void {
    this.climbLocations = [];
    if (this.processedGames) {
      this.gamesLabels = this.processedGames.gamesVector;
      this.climbLocations.push({ data: this.processedGames.climbLocations, label: 'Games Scores' });
    }
  }

}
