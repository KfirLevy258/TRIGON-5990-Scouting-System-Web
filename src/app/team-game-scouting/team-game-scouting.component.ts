import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Game, GameService, ProcessedGames} from '../game.service';
import {Observable} from 'rxjs';
import {ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';

class DataSet {
  data: Array<number> = [];
  label: string;

  constructor(public _label: string) {
    this.label = _label;
  }
}

@Component({
  selector: 'app-team-game-scouting',
  templateUrl: './team-game-scouting.component.html',
  styleUrls: ['./team-game-scouting.component.scss']
})
export class TeamGameScoutingComponent implements OnInit, OnChanges {
  @Input() tournament;
  @Input() teamNumber;

  games$: Observable<Game[]>;
  games: Array<Game> = [];
  processedGames: ProcessedGames;


  constructor(private gameService: GameService) { }

  // teleop Score Graph
  teleopInnerScore: DataSet = new DataSet('inner score');
  teleopOuterScore: DataSet = new DataSet('outer score');
  teleopUpperScore: DataSet = new  DataSet('upper score');
  teleopBottomScore: DataSet = new DataSet('bottom Score');
  teleopScoreData: ChartDataSets[] = [];
  teleopScoreLabels: Label[] = [];
  teleopScoreOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
        }
      }]
    }
  };

  teleopScoreColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  teleopScoreLegend = true;
  teleopScorePlugins = [];
  teleopScoreType = 'line';

  teleopInnerSelect = false;
  teleopOuterSelect = false;
  teleopUpperSelect = true;
  teleopBottomSelect = true;

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges): void {
    this.games$ = this.gameService.getGames(this.tournament, this.teamNumber);
    this.games$
      .subscribe(res => {
        this.teleopInnerScore.data = [];
        this.teleopOuterScore.data = [];
        this.teleopUpperScore.data = [];
        this.teleopBottomScore.data = [];
        this.teleopScoreLabels = [];

        this.games = res;
        this.processedGames = this.gameService.processGames(res);
        res.forEach(game => {
          this.teleopScoreLabels.push(game.gameNumber);
          this.teleopInnerScore.data.push(game.teleopInnerScore);
          this.teleopOuterScore.data.push(game.teleopOuterScore);
          this.teleopUpperScore.data.push(game.teleopInnerScore + game.teleopOuterScore);
          this.teleopBottomScore.data.push(game.teleopBottomScore);
          this.drawTeleopScores();
        });
      });
  }

  drawTeleopScores() {
    this.teleopScoreData = [];
    if (this.teleopInnerSelect) { this.teleopScoreData.push(this.teleopInnerScore); }
    if (this.teleopOuterSelect) { this.teleopScoreData.push(this.teleopOuterScore); }
    if (this.teleopUpperSelect) { this.teleopScoreData.push(this.teleopUpperScore); }
    if (this.teleopBottomSelect) { this.teleopScoreData.push(this.teleopBottomScore); }

  }
}
