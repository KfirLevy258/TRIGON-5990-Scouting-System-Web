import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Game, ProcessedGames} from '../game.service';
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

  @Input() games: Array<Game> = [];
  @Input() processedGames: ProcessedGames;


  constructor() { }

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
    this.gamesScoreData = [];
    if (this.processedGames) {
      this.gamesLabels = this.processedGames.gamesVector;
      this.gamesScoreData.push({ data: this.processedGames.gamesScoresVector, label: 'Games Scores' });
    }
  }

}
