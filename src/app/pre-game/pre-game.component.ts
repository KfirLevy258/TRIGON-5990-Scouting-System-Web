import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {defaultDialogConfig} from '../default-dialog-config';
import {MatDialog} from '@angular/material';
import {DialogAlertComponent} from '../dialog-alert/dialog-alert.component';
import {take} from 'rxjs/operators';
import {Game, GameService, ProcessedGames} from '../game.service';
import {zip} from 'rxjs';
import {Color} from 'ng2-charts';
import {ChartOptions, ChartType} from 'chart.js';
import {DialogAlliancesComponent} from '../dialog-alliances/dialog-alliances.component';

@Component({
  selector: 'app-pre-game',
  templateUrl: './pre-game.component.html',
  styleUrls: ['./pre-game.component.scss']
})
export class PreGameComponent implements OnInit {
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
  gameNumberForm: FormGroup;
  gameNumber: string;
  eventKey: string;
  eventCode = '_qm';
  tournament: string;
  blueTeams: Array<string> = [];
  redTeams: Array<string> = [];
  allTeams: Array<string> = [];
  homeTeam: string;
  ourTeam: Array<string>;         // teams including Home Team
  isLoading = false;

  gamesBlue1: Array<Game> = [];
  gamesBlue2: Array<Game> = [];
  gamesBlue3: Array<Game> = [];
  gamesRed1: Array<Game> = [];
  gamesRed2: Array<Game> = [];
  gamesRed3: Array<Game> = [];

  processedGamesBlue1: ProcessedGames;
  processedGamesBlue2: ProcessedGames;
  processedGamesBlue3: ProcessedGames;
  processedGamesRed1: ProcessedGames;
  processedGamesRed2: ProcessedGames;
  processedGamesRed3: ProcessedGames;

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

  blueScore = 0;
  redScore = 0;
  blueWinPercent = 0;
  redWinPercent = 0;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private dialog: MatDialog,
              private gameService: GameService) {
    this.gameNumberForm = fb.group({
      gameNumber: ['', [Validators.required]],
      eventCode: ['_qm', Validators.required]
    });
  }

  ngOnInit() {
    this.eventKey = localStorage.getItem('event_key');
    this.tournament = localStorage.getItem('tournament');
    this.homeTeam = localStorage.getItem('homeTeam');

    // ToDo - Remove
    // this.gameNumber = '42';
    // this.isLoading = true;
    // this.getTeams();
  }

  gameSelected() {
    this.gameNumber = this.gameNumberForm.getRawValue().gameNumber;
    this.eventCode = this.gameNumberForm.getRawValue().eventCode;
    this.isLoading = true;
    this.getTeams();
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
    this.http.get('https://www.thebluealliance.com/api/v3/match/' + this.eventKey + this.eventCode + this.gameNumber, {headers})
      .subscribe((matchData: any) => {
        if (matchData) {
          this.blueTeams = matchData.alliances.blue.team_keys;
          this.redTeams = matchData.alliances.red.team_keys;
          this.ourTeam = null;
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.blueTeams.length; i++) {
            this.redTeams[i] = (this.redTeams[i].substring(3, 10));
            this.blueTeams[i] = (this.blueTeams[i].substring(3, 10));
            if (this.redTeams[i] === this.homeTeam) { this.ourTeam = this.redTeams; }
            if (this.blueTeams[i] === this.homeTeam) { this.ourTeam = this.blueTeams; }
          }
          this.allTeams = [...this.blueTeams, ...this.redTeams];
          this.getGames();
        }
      }, (err) => {
        console.log(err);
        this.dialog.open(DialogAlertComponent, dialogConfig)
          .afterClosed()
          .pipe(take(1))
          .subscribe();
      });
  }

  manualTeamsSelect() {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: 'Manual Teams Select',
    };

    this.dialog.open(DialogAlliancesComponent, dialogConfig)
      .afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        this.blueTeams = res.blueTeams;
        this.redTeams = res.redTeams;
        this.allTeams = [...this.blueTeams, ...this.redTeams];
        this.gameNumber = '0';
      });
  }

  getGames() {
    this.isLoading = true;
    zip(
      this.gameService.getGames(this.tournament, this.blueTeams[0]),
      this.gameService.getGames(this.tournament, this.blueTeams[1]),
      this.gameService.getGames(this.tournament, this.blueTeams[2]),
      this.gameService.getGames(this.tournament, this.redTeams[0]),
      this.gameService.getGames(this.tournament, this.redTeams[1]),
      this.gameService.getGames(this.tournament, this.redTeams[2]),
    )
      .subscribe(res => {
        this.gamesBlue1 = res[0];
        this.gamesBlue2 = res[1];
        this.gamesBlue3 = res[2];
        this.gamesRed1 = res[3];
        this.gamesRed2 = res[4];
        this.gamesRed3 = res[5];

        this.processedGamesBlue1 = this.gameService.processGames(this.gamesBlue1);
        this.processedGamesBlue2 = this.gameService.processGames(this.gamesBlue2);
        this.processedGamesBlue3 = this.gameService.processGames(this.gamesBlue3);
        this.processedGamesRed1 = this.gameService.processGames(this.gamesRed1);
        this.processedGamesRed2 = this.gameService.processGames(this.gamesRed2);
        this.processedGamesRed3 = this.gameService.processGames(this.gamesRed3);
        // tslint:disable-next-line:max-line-length
        this.blueScore = this.processedGamesBlue1.predictedGameScore + this.processedGamesBlue2.predictedGameScore + this.processedGamesBlue3.predictedGameScore;
        // tslint:disable-next-line:max-line-length
        this.redScore = this.processedGamesRed1.predictedGameScore + this.processedGamesRed2.predictedGameScore + this.processedGamesRed3.predictedGameScore;
        this.blueWinPercent = Math.round((this.blueScore / (this.redScore + this.blueScore)) * 100);
        this.redWinPercent = Math.round((this.redScore / (this.blueScore + this.redScore)) * 100);
        this.isLoading = false;
      });
  }
}
