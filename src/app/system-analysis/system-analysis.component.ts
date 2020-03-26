import { Component, OnInit } from '@angular/core';
import {defaultDialogConfig} from '../default-dialog-config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DialogAlertComponent} from '../dialog-alert/dialog-alert.component';
import {take} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Color} from 'ng2-charts';
import {GameService, ProcessedGames} from '../game.service';
import {zip} from 'rxjs';

@Component({
  selector: 'app-system-analysis',
  templateUrl: './system-analysis.component.html',
  styleUrls: ['./system-analysis.component.scss']
})
export class SystemAnalysisComponent implements OnInit {
  eventKey: string;
  tournament: string;
  redScoresVector: ChartDataSets[] = [];
  blueScoresVector: ChartDataSets[] = [];
  sortMatches = [];
  gamesList = [];
  redTBAScore = [];
  blueTBAScore = [];
  tbaWiningBlue  = 0;
  ourDataWiningBlue = 0;
  redOurData = [];
  blueOurData = [];
  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];
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
  lineChartPlugins = [];
  lineChartLegend = true;
  lineChartType: ChartType = 'line';
  isLoading = true;

  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private gameService: GameService) { }


  getAllianceScore(alliance): Promise<number> {
    return new Promise<number>(resolve => {
      let allianceScore;
      allianceScore = 0;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < alliance.length; i++) {
        alliance[i] = alliance[i].split('frc')[1];
      }
      const obs0 = this.gameService.getGames(this.tournament, alliance[0]);
      const obs1 = this.gameService.getGames(this.tournament, alliance[1]);
      const obs2 = this.gameService.getGames(this.tournament, alliance[2]);
      zip(obs0, obs1, obs2)
        .subscribe(res => {
          let processedGames: ProcessedGames;
          processedGames = this.gameService.processGames(res[0], 100);
          allianceScore += processedGames.predictedGameScore;
          processedGames = this.gameService.processGames(res[1], 100);
          allianceScore += processedGames.predictedGameScore;
          processedGames = this.gameService.processGames(res[2], 100);
          allianceScore += processedGames.predictedGameScore;
          resolve(allianceScore);
        });
      // tslint:disable-next-line:prefer-for-of
      // for (let i = 0; i < alliance.length; i++) {
      //   // tslint:disable-next-line:prefer-const
      //   let processedGames: ProcessedGames;
      //   this.gameService.getGames(this.tournament, alliance[i])
      //     .subscribe(res => {
      //       processedGames = this.gameService.processGames(res, 100);
      //       allianceScore += processedGames.predictedGameScore;
      //       resolve(allianceScore);
      //     });
      // }
    });


  }

  getTeams() {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: 'Pre Game',
      message: 'invalid game number'
    };

    let headers: HttpHeaders = new HttpHeaders();
    // noinspection SpellCheckingInspection
    headers = headers.append('X-TBA-Auth-Key', 'ptM95D6SCcHO95D97GLFStGb4cWyxtBKNOI9FX5QmBirDnjebphZAEpPcwXNr4vH');
    this.http.get('https://www.thebluealliance.com/api/v3/event/' + this.eventKey + '/matches', {headers})
      .subscribe((matchesData: any) => {
          if (matchesData) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < matchesData.length; i++) {
              // tslint:disable-next-line:triple-equals
              if (matchesData[i].comp_level == 'qm') {
                this.sortMatches.push(matchesData[i]);
              }
            }
            this.sortMatches = this.sortMatches.sort(matchSort);
            console.log(this.sortMatches);
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.sortMatches.length; i++) {
              this.getAllianceScore(this.sortMatches[i].alliances.red.team_keys)
                .then(res => {
                  this.redOurData.push(res);
                });
              this.blueOurData.push(this.getAllianceScore(this.sortMatches[i].alliances.blue.team_keys));
              this.redTBAScore.push(this.sortMatches[i].alliances.red.score);
              this.blueTBAScore.push(this.sortMatches[i].alliances.blue.score);
              this.gamesList.push(i);
              // tslint:disable-next-line:max-line-length
              // if (this.getAllianceScore(this.sortMatches[i].alliances.red.team_keys) < this.blueOurData.push(this.getAllianceScore(this.sortMatches[i].alliances.blue.team_keys))){
              //   this.ourDataWiningBlue ++;
              // }
              // tslint:disable-next-line:triple-equals
              if (this.sortMatches[i].winning_alliance == 'blue') {
                this.tbaWiningBlue ++;
              }
            }
            this.redScoresVector.push(
              { data: this.redTBAScore, label: 'TBA data'},
              { data: this.redOurData, label: 'Competition data'}
            );
            this.blueScoresVector.push(
              { data: this.blueTBAScore, label: 'TBA data'},
              { data: this.blueOurData, label: 'Competition data'}
            );
            console.log(this.ourDataWiningBlue);
            console.log(this.tbaWiningBlue);
            this.isLoading = false;
          }
        },
        (err) => {
          console.log(err);
          this.dialog.open(DialogAlertComponent, dialogConfig)
            .afterClosed()
            .pipe(take(1))
            .subscribe();
        });
  }


  ngOnInit() {
    this.eventKey = localStorage.getItem('event_key');
    this.tournament = localStorage.getItem('tournament');
    this.getTeams();
  }



}

const matchSort = (a, b) => {
  const aNumber = Number(a.match_number);
  const bNumber = Number(b.match_number);
  if (aNumber > bNumber) {
    return 1;
  }
  if (aNumber < bNumber) {
    return -1;
  }
  return 0;
};
