import {Component, Input, OnInit} from '@angular/core';
import {ProcessedGames} from '../game.service';
import {Color} from 'ng2-charts';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';

@Component({
  selector: 'app-pre-game-teleop',
  templateUrl: './pre-game-teleop.component.html',
  styleUrls: ['./pre-game-teleop.component.scss']
})
export class PreGameTeleopComponentComponent implements OnInit {

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
        anchor: 'end',
        align: 'end',
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
  };
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
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  blueInnerAVG = 0;
  blueOuterAVG = 0;
  blueBottomAVG = 0;
  blueTotalScore = 0;
  games = 0;
  gamesList: Array<string> = [];
  blueInnerAVGBar: ChartDataSets[] = [];
  blueOuterAVGBar: ChartDataSets[] = [];
  blueBottomAVGBar: ChartDataSets[] = [];
  blueScoreBar: ChartDataSets[] = [];
  blueTotalScorePie: ChartDataSets[] = [];
  blueInnerVector: ChartDataSets[] = [];
  blueOuterVector: ChartDataSets[] = [];
  blueBottomVector: ChartDataSets[] = [];

  constructor() { }

  ngOnInit() {
    this.blueInnerAVG = this.blue1.teleopAVGInner + this.blue2.teleopAVGInner + this.blue3.teleopAVGInner;
    this.blueOuterAVG = this.blue1.teleopAVGOuter + this.blue2.teleopAVGOuter + this.blue3.teleopAVGOuter;
    this.blueBottomAVG = this.blue1.teleopAVGBottom + this.blue2.teleopAVGBottom + this.blue3.teleopAVGBottom;
    this.blueTotalScore = this.blueInnerAVG + this.blueOuterAVG + this.blueBottomAVG;
    this.blueInnerAVGBar.push({
      data: [
        this.blue1.teleopAVGInner,
        this.blue2.teleopAVGInner,
        this.blue3.teleopAVGInner,
      ],
      label: 'Average Inner Score'
    });
    this.blueOuterAVGBar.push({
      data: [
        this.blue1.teleopAVGOuter,
        this.blue2.teleopAVGOuter,
        this.blue3.teleopAVGOuter,
      ],
      label: 'Average Outer Score'
    });
    this.blueBottomAVGBar.push({
      data: [
        this.blue1.teleopAVGBottom,
        this.blue2.teleopAVGBottom,
        this.blue3.teleopAVGBottom,
      ],
      label: 'Average Bottom Score'
    });
    this.blueTotalScorePie.push({
      data: [
        this.blue1.teleopAVGBottom + this.blue1.teleopAVGOuter + this.blue1.teleopAVGInner,
        this.blue2.teleopAVGBottom + this.blue2.teleopAVGOuter + this.blue2.teleopAVGInner,
        this.blue3.teleopAVGBottom + this.blue3.teleopAVGOuter + this.blue3.teleopAVGInner,
      ],
      label: 'Average Bottom Score'
    });
    this.blueScoreBar.push({
      data: [
        this.blue1.teleopAVGBottom + this.blue1.teleopAVGOuter + this.blue1.teleopAVGInner,
        this.blue2.teleopAVGBottom + this.blue2.teleopAVGOuter + this.blue2.teleopAVGInner,
        this.blue3.teleopAVGBottom + this.blue3.teleopAVGOuter + this.blue3.teleopAVGInner,
      ],
      label: 'Average Score'
    });
    this.blueInnerVector.push(
      { data: this.blue1.teleopInnerScoreVector, label: this.blueTeams[0]},
      { data: this.blue2.teleopInnerScoreVector, label: this.blueTeams[1]},
      { data: this.blue3.teleopInnerScoreVector, label: this.blueTeams[2]}
    );
    this.blueOuterVector.push(
      { data: this.blue1.teleopOuterScoreVector, label: this.blueTeams[0]},
      { data: this.blue2.teleopOuterScoreVector, label: this.blueTeams[1]},
      { data: this.blue3.teleopOuterScoreVector, label: this.blueTeams[2]}
    );
    this.blueBottomVector.push(
      { data: this.blue1.teleopBottomScoreVector, label: this.blueTeams[0]},
      { data: this.blue2.teleopBottomScoreVector, label: this.blueTeams[1]},
      { data: this.blue3.teleopBottomScoreVector, label: this.blueTeams[2]}
    );
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
