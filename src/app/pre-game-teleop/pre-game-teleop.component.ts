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
  @Input() red1: ProcessedGames;
  @Input() red2: ProcessedGames;
  @Input() red3: ProcessedGames;
  @Input() redTeams: Array<string>

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

  blueInnerAVG = 0;
  blueOuterAVG = 0;
  blueBottomAVG = 0;
  blueTotalScore = 0;
  blueGames = 0;
  blueGamesList: Array<string> = [];
  blueInnerAVGBar: ChartDataSets[] = [];
  blueOuterAVGBar: ChartDataSets[] = [];
  blueBottomAVGBar: ChartDataSets[] = [];
  blueScoreBar: ChartDataSets[] = [];
  blueTotalScorePie: ChartDataSets[] = [];
  blueInnerVector: ChartDataSets[] = [];
  blueOuterVector: ChartDataSets[] = [];
  blueBottomVector: ChartDataSets[] = [];

  redInnerAVG = 0;
  redOuterAVG = 0;
  redBottomAVG = 0;
  redTotalScore = 0;
  redGames = 0;
  redGamesList: Array<string> = [];
  redInnerAVGBar: ChartDataSets[] = [];
  redOuterAVGBar: ChartDataSets[] = [];
  redBottomAVGBar: ChartDataSets[] = [];
  redScoreBar: ChartDataSets[] = [];
  redTotalScorePie: ChartDataSets[] = [];
  redInnerVector: ChartDataSets[] = [];
  redOuterVector: ChartDataSets[] = [];
  redBottomVector: ChartDataSets[] = [];

  constructor() { }

  ngOnInit() {
    this.blueInnerAVG = this.blue1.teleopAVGInner + this.blue2.teleopAVGInner + this.blue3.teleopAVGInner;
    this.blueOuterAVG = this.blue1.teleopAVGOuter + this.blue2.teleopAVGOuter + this.blue3.teleopAVGOuter;
    this.blueBottomAVG = this.blue1.teleopAVGBottom + this.blue2.teleopAVGBottom + this.blue3.teleopAVGBottom;
    this.blueTotalScore = this.blueInnerAVG + this.blueOuterAVG + this.blueBottomAVG;
    this.redInnerAVG = this.red1.teleopAVGInner + this.red2.teleopAVGInner + this.red3.teleopAVGInner;
    this.redOuterAVG = this.red1.teleopAVGOuter + this.red2.teleopAVGOuter + this.red3.teleopAVGOuter;
    this.redBottomAVG = this.red1.teleopAVGBottom + this.red2.teleopAVGBottom + this.red3.teleopAVGBottom;
    this.redTotalScore = this.redInnerAVG + this.redOuterAVG + this.redBottomAVG;
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
    if (this.blue1.gamesPlayed > this.blueGames) {
      this.blueGames = this.blue1.gamesPlayed;
    }
    if (this.blue2.gamesPlayed > this.blueGames) {
      this.blueGames = this.blue2.gamesPlayed;
    }
    if (this.blue3.gamesPlayed > this.blueGames) {
      this.blueGames = this.blue3.gamesPlayed;
    }
    // tslint:disable-next-line:variable-name
    for (let _i = 1; _i < (this.blueGames + 1); _i++) {
      this.blueGamesList.push(_i.toString());
    }


    this.redInnerAVGBar.push({
      data: [
        this.red1.teleopAVGInner,
        this.red2.teleopAVGInner,
        this.red3.teleopAVGInner,
      ],
      label: 'Average Inner Score'
    });
    this.redOuterAVGBar.push({
      data: [
        this.red1.teleopAVGOuter,
        this.red2.teleopAVGOuter,
        this.red3.teleopAVGOuter,
      ],
      label: 'Average Outer Score'
    });
    this.redBottomAVGBar.push({
      data: [
        this.red1.teleopAVGBottom,
        this.red2.teleopAVGBottom,
        this.red3.teleopAVGBottom,
      ],
      label: 'Average Bottom Score'
    });
    this.redTotalScorePie.push({
      data: [
        this.red1.teleopAVGBottom + this.blue1.teleopAVGOuter + this.blue1.teleopAVGInner,
        this.red2.teleopAVGBottom + this.blue2.teleopAVGOuter + this.blue2.teleopAVGInner,
        this.red3.teleopAVGBottom + this.blue3.teleopAVGOuter + this.blue3.teleopAVGInner,
      ],
      label: 'Average Bottom Score'
    });
    this.redScoreBar.push({
      data: [
        this.red1.teleopAVGBottom + this.blue1.teleopAVGOuter + this.blue1.teleopAVGInner,
        this.red2.teleopAVGBottom + this.blue2.teleopAVGOuter + this.blue2.teleopAVGInner,
        this.red3.teleopAVGBottom + this.blue3.teleopAVGOuter + this.blue3.teleopAVGInner,
      ],
      label: 'Average Score'
    });
    this.redInnerVector.push(
      { data: this.red1.teleopInnerScoreVector, label: this.redTeams[0]},
      { data: this.red2.teleopInnerScoreVector, label: this.redTeams[1]},
      { data: this.red3.teleopInnerScoreVector, label: this.redTeams[2]}
    );
    this.redOuterVector.push(
      { data: this.red1.teleopOuterScoreVector, label: this.redTeams[0]},
      { data: this.red2.teleopOuterScoreVector, label: this.redTeams[1]},
      { data: this.red3.teleopOuterScoreVector, label: this.redTeams[2]}
    );
    this.redBottomVector.push(
      { data: this.red1.teleopBottomScoreVector, label: this.redTeams[0]},
      { data: this.red2.teleopBottomScoreVector, label: this.redTeams[1]},
      { data: this.red3.teleopBottomScoreVector, label: this.redTeams[2]}
    );
    if (this.red1.gamesPlayed > this.redGames) {
      this.redGames = this.red1.gamesPlayed;
    }
    if (this.red2.gamesPlayed > this.redGames) {
      this.redGames = this.red2.gamesPlayed;
    }
    if (this.red3.gamesPlayed > this.redGames) {
      this.redGames = this.red3.gamesPlayed;
    }
    // tslint:disable-next-line:variable-name
    for (let _i = 1; _i < (this.redGames + 1); _i++) {
      this.redGamesList.push(_i.toString());
    }
  }

}
