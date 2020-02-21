import {Component, Input, OnInit} from '@angular/core';
import {ProcessedGames} from '../game.service';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Color} from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-pre-game-auto',
  templateUrl: './pre-game-auto.component.html',
  styleUrls: ['./pre-game-auto.component.scss']
})
export class PreGameAutoComponent implements OnInit {

  @Input() tournament: string;
  @Input() blue1: ProcessedGames;
  @Input() blue2: ProcessedGames;
  @Input() blue3: ProcessedGames;
  @Input() blueTeams: Array<string>;
  @Input() red1: ProcessedGames;
  @Input() red2: ProcessedGames;
  @Input() red3: ProcessedGames;
  @Input() redTeams: Array<string>;


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
    scales: { xAxes: [{}], yAxes: [{}] },
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
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];
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
  blueInnerAVG = 0;
  blueOuterAVG = 0;
  blueBottomAVG = 0;
  blueTotalScore = 0;
  blueAutoInnerAVGVector: ChartDataSets[] = [];
  blueAutoOuterAVGVector: ChartDataSets[] = [];
  blueAutoBottomAVGVector: ChartDataSets[] = [];
  blueAutoTotalScoreVector: ChartDataSets[] = [];
  redInnerAVG = 0;
  redOuterAVG = 0;
  redBottomAVG = 0;
  redTotalScore = 0;
  redAutoInnerAVGVector: ChartDataSets[] = [];
  redAutoOuterAVGVector: ChartDataSets[] = [];
  redAutoBottomAVGVector: ChartDataSets[] = [];
  redAutoTotalScoreVector: ChartDataSets[] = [];
  constructor() { }

  ngOnInit() {
    this.blueInnerAVG = this.blue1.autoAVGInner + this.blue2.autoAVGInner + this.blue3.autoAVGInner;
    this.blueOuterAVG = this.blue1.autoAVGOuter + this.blue2.autoAVGOuter + this.blue3.autoAVGOuter;
    this.blueBottomAVG = this.blue1.autoAVGBottom + this.blue2.autoAVGBottom + this.blue3.autoAVGBottom;
    this.blueTotalScore = this.blueInnerAVG + this.blueOuterAVG + this.blueBottomAVG;
    this.redInnerAVG = this.red1.autoAVGInner + this.red2.autoAVGInner + this.red3.autoAVGInner;
    this.redOuterAVG = this.red1.autoAVGOuter + this.red2.autoAVGOuter + this.red3.autoAVGOuter;
    this.redBottomAVG = this.red1.autoAVGBottom + this.red2.autoAVGBottom + this.red3.autoAVGBottom;
    this.redTotalScore = this.redInnerAVG + this.redOuterAVG + this.redBottomAVG;
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
      label: 'Average Bottom Score'
    });
    this.blueAutoTotalScoreVector.push({
      data: [
        this.blue1.autoAVGBottom + this.blue1.autoAVGOuter + this.blue1.autoAVGInner,
        this.blue2.autoAVGBottom + this.blue2.autoAVGOuter + this.blue2.autoAVGInner,
        this.blue3.autoAVGBottom + this.blue3.autoAVGOuter + this.blue3.autoAVGInner,
      ],
      label: 'Average Bottom Score'
    });
    this.redAutoInnerAVGVector.push({
      data: [
        this.red1.autoAVGInner,
        this.red2.autoAVGInner,
        this.red3.autoAVGInner,
      ],
      label: 'Average Inner Score'
    });
    this.redAutoOuterAVGVector.push({
      data: [
        this.red1.autoAVGOuter,
        this.red2.autoAVGOuter,
        this.red3.autoAVGOuter,
      ],
      label: 'Average Outer Score'
    });
    this.redAutoBottomAVGVector.push({
      data: [
        this.red1.autoAVGBottom,
        this.red2.autoAVGBottom,
        this.red3.autoAVGBottom,
      ],
      label: 'Average Bottom Score'
    });
    this.redAutoTotalScoreVector.push({
      data: [
        this.red1.autoAVGBottom + this.red1.autoAVGOuter + this.red1.autoAVGInner,
        this.red2.autoAVGBottom + this.red2.autoAVGOuter + this.red2.autoAVGInner,
        this.red3.autoAVGBottom + this.red3.autoAVGOuter + this.red3
          .autoAVGInner,
      ],
      label: 'Average Bottom Score'
    });

  }

}
