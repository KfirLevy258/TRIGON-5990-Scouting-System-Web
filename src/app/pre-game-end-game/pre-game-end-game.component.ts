import {Component, Input, OnInit} from '@angular/core';
import {ProcessedGames} from "../game.service";
import {Color} from "ng2-charts";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";

@Component({
  selector: 'app-pre-game-end-game',
  templateUrl: './pre-game-end-game.component.html',
  styleUrls: ['./pre-game-end-game.component.scss']
})
export class PreGameEndGameComponent implements OnInit {
  @Input() tournament: string;
  @Input() blue1: ProcessedGames;
  @Input() blue2: ProcessedGames;
  @Input() blue3: ProcessedGames;
  @Input() blueTeams: Array<string>;
  outerLineColor: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.28)',
    },
  ];
  innerLineColor: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(0,0,255,0.28)',
    },
  ];
  bottomLineColor: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(0,255,00,0.28)',
    },
  ];
  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{
        ticks: {
          min: 0,
        }
      }] },
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'center',
        formatter(val) {
          return Math.round(val * 100) / 100;
        },
        font: {
          size: 20,
        },
      }
    }
  };
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];
  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'center',
        formatter(val) {
          return Math.round(val * 100) / 100;
        },
        font: {
          size: 20,
        },
      }
    },
  };
  lineChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'center',
        formatter(val) {
          return Math.round(val * 100) / 100;
        },
        font: {
          size: 15,
        },
      }
    },
  };
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  games = 0;
  gamesList: Array<string> = [];
  blueClimbAttemptsBar: ChartDataSets[] = [];
  blueClimbSucceedBar: ChartDataSets[] = [];
  blueClimbSucceedPercentBar: ChartDataSets[] = [];
  blueClimbSucceedPie: ChartDataSets[] = [];


  constructor() { }

  ngOnInit() {
    this.blueClimbAttemptsBar.push({
      data: [
        this.blue1.climbAttempts,
        this.blue2.climbAttempts,
        this.blue3.climbAttempts,
      ],
      label: 'Climb attempts'
    });
    this.blueClimbSucceedBar.push({
      data: [
        this.blue1.climbSuccessfully,
        this.blue2.climbSuccessfully,
        this.blue3.climbSuccessfully,
      ],
        label: 'Climb success'
    });
    this.blueClimbSucceedPercentBar.push({
      data: [
        this.blue1.climbSuccess,
        this.blue2.climbSuccess,
        this.blue3.climbSuccess
      ],
      label: 'Success percent'
    });
    this.blueClimbSucceedPie.push({
      data: [
        this.blue1.climbSuccess,
        this.blue2.climbSuccess,
        this.blue3.climbSuccess
      ],
      label: 'Climb success'
    });
    if (this.blue1.gamesPlayed > this.games) {
      this.games = this.blue1.gamesPlayed;
    }
    if (this.blue2.gamesPlayed > this.games) {
      this.games = this.blue2.gamesPlayed;
    }
    if (this.blue3.gamesPlayed > this.games) {
      this.games = this.blue3.gamesPlayed;
    }
    // tslint:disable-next-line:variable-name
    for (let _i = 1; _i < (this.games + 1); _i++) {
      this.gamesList.push(_i.toString());
    }
  }

}
