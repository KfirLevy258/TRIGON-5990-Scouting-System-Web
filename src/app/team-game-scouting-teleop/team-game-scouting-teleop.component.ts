import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {Game, GameService, ProcessedGames} from '../game.service';
import {ChartDataSets, ChartType} from 'chart.js';
import {Color, Label} from 'ng2-charts';

@Component({
  selector: 'app-team-game-scouting-teleop',
  templateUrl: './team-game-scouting-teleop.component.html',
  styleUrls: ['./team-game-scouting-teleop.component.scss']
})
export class TeamGameScoutingTeleopComponent implements OnInit, OnChanges {

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
  lineChartType: ChartType = 'line';

  teleopOuterScoreData: ChartDataSets[] = [];
  teleopInnerScoreData: ChartDataSets[] = [];
  teleopBottomScoreData: ChartDataSets[] = [];
  teleopCyclesData: ChartDataSets[] = [];

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges): void {
    this.games$ = this.gameService.getGames(this.tournament, this.teamNumber);
    this.games$
      .subscribe(res => {
        this.teleopOuterScoreData = [];
        this.teleopInnerScoreData = [];
        this.teleopBottomScoreData = [];
        this.teleopCyclesData = [];

        this.games = res;
        this.processedGames = this.gameService.processGames(res);
        this.gamesLabels = this.processedGames.gamesVector;
        this.teleopOuterScoreData.push({data: this.processedGames.teleopOuterScoreVector, label: 'Outer Score'});
        this.teleopInnerScoreData.push({data: this.processedGames.teleopInnerScoreVector, label: 'Inner Score'});
        this.teleopBottomScoreData.push({data: this.processedGames.teleopBottomScoreVector, label: 'Bottom Score'});
        this.teleopCyclesData.push({data: this.processedGames.teleopCyclesVector, label: 'Upper cycles'});
      });
  }

}
