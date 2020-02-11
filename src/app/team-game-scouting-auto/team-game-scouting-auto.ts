import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {Game, GameService, ProcessedGames} from '../game.service';
import {ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';

@Component({
  selector: 'app-team-game-scouting-auto',
  templateUrl: './team-game-scouting-auto.html',
  styleUrls: ['./team-game-scouting-auto.scss']
})

// tslint:disable-next-line:component-class-suffix
export class TeamGameScoutingAuto implements OnInit, OnChanges {

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

  autoBottomScoreData: ChartDataSets[] = [];
  autoInnerScoreData: ChartDataSets[] = [];
  autoOuterScoreData: ChartDataSets[] = [];
  autoUpperScoreData: ChartDataSets[] = [];
  autoTotalScoreData: ChartDataSets[] = [];

  autoBottomScorePctData: ChartDataSets[] = [];
  autoUpperScorePctData: ChartDataSets[] = [];
  autoTotalScorePctData: ChartDataSets[] = [];

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges): void {
    this.games$ = this.gameService.getGames(this.tournament, this.teamNumber);
    this.games$
      .subscribe(res => {
        this.autoBottomScoreData = [];
        this.autoInnerScoreData = [];
        this.autoOuterScoreData = [];
        this.autoUpperScoreData = [];
        this.autoTotalScoreData = [];
        this.autoBottomScorePctData = [];
        this.autoUpperScorePctData = [];
        this.autoTotalScorePctData = [];

        this.games = res;
        this.processedGames = this.gameService.processGames(res);
        this.gamesLabels = this.processedGames.gamesVector;
        this.autoBottomScoreData.push({ data: this.processedGames.autoBottomScoreVector, label: 'Bottom Score'});
        // this.autoInnerScoreData.push({ data: this.processedGames1.autoInnerScoreVector, label: 'Inner Score'});
        // this.autoOuterScoreData.push({ data: this.processedGames1.autoOuterScoreVector, label: 'Outer Score'});
        this.autoUpperScoreData.push(
          { data: this.processedGames.autoInnerScoreVector, label: 'Inner Score'},
          { data: this.processedGames.autoOuterScoreVector, label: 'Outer Score'},
          { data: this.processedGames.autoUpperScoreVector, label: 'Upper Score'}
        );
        this.autoTotalScoreData.push({ data: this.processedGames.autoTotalScoreVector, label: 'Total Score'});
        this.autoBottomScorePctData.push({ data: this.processedGames.autoBottomScorePctVector, label: 'Bottom Score %'});
        this.autoUpperScorePctData.push({ data: this.processedGames.autoUpperScorePctVector, label: 'Upper Score %'});
        this.autoTotalScorePctData.push({ data: this.processedGames.autoTotalScorePctVector, label: 'Total Score %'});
      });
  }

}
