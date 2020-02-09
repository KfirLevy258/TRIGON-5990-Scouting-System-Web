import {Component, Input, OnInit} from '@angular/core';
import {ProcessedGames} from '../game.service';
import {Color} from 'ng2-charts';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';

@Component({
  selector: 'app-pre-game-summary',
  templateUrl: './pre-game-summary.component.html',
  styleUrls: ['./pre-game-summary.component.scss']
})
export class PreGameSummaryComponent implements OnInit {

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
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter(val) {
          return Math.round(val * 100) / 100;
        }
      }
    }
  };  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [
  ];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];
  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  blueTotalGamePieces = 0;
  blueTotalShoots = 0;
  blueShootsSuccessPercent = 0;
  blueAutoInnerAVGVector: ChartDataSets[] = [];
  blueAutoOuterAVGVector: ChartDataSets[] = [];
  blueAutoBottomAVGVector: ChartDataSets[] = [];
  blueAutoTotalScoreVector: ChartDataSets[] = [];

  constructor() { }

  ngOnInit() {
    this.blueTotalGamePieces = this.blue1.totalGamePieces + this.blue2.totalGamePieces + this.blue3.totalGamePieces;
    this.blueTotalShoots = this.blue1.totalShoots + this.blue2.totalShoots + this.blue3.totalShoots;
    this.blueShootsSuccessPercent = (this.blueTotalGamePieces / this.blueTotalShoots) * 100;
    this.blueAutoInnerAVGVector.push({
      data: [
        this.blue1.autoAVGInner,
        this.blue2.autoAVGInner,
        this.blue3.autoAVGInner,
      ],
      label: 'Average Inner Score'
    });
    this.blueAutoOuterAVGVector.push({
      data: [
        this.blue1.autoAVGOuter,
        this.blue2.autoAVGOuter,
        this.blue3.autoAVGOuter,
      ],
      label: 'Average Outer Score'
    });
    this.blueAutoBottomAVGVector.push({
      data: [
        this.blue1.autoAVGBottom,
        this.blue2.autoAVGBottom,
        this.blue3.autoAVGBottom,
      ],
      label: 'Average Bottom Score',

    });
    this.blueAutoTotalScoreVector.push({
      data: [
        this.blue1.autoAVGBottom + this.blue1.autoAVGOuter + this.blue1.autoAVGInner,
        this.blue2.autoAVGBottom + this.blue2.autoAVGOuter + this.blue2.autoAVGInner,
        this.blue3.autoAVGBottom + this.blue3.autoAVGOuter + this.blue3.autoAVGInner,
      ],
      label: 'Average Bottom Score'
    });

  }
}
