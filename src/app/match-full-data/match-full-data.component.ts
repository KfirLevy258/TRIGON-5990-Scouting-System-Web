import { Component, OnInit } from '@angular/core';
import {Color} from 'ng2-charts';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Game, GameService, ProcessedGames} from '../game.service';
import {ChartOptions, ChartType} from 'chart.js';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {defaultDialogConfig} from '../default-dialog-config';
import {DialogAlertComponent} from '../dialog-alert/dialog-alert.component';
import {take} from 'rxjs/operators';
import {Observable, ObservedValueOf, zip} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-match-full-data',
  templateUrl: './match-full-data.component.html',
  styleUrls: ['./match-full-data.component.scss']
})
export class MatchFullDataComponent implements OnInit {
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

  gameBlue1: Game;
  gameBlue2: Game;
  gameBlue3: Game;
  gameRed1: Game;
  gameRed2: Game;
  gameRed3: Game;

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
          this.getGames(this.gameNumber);
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

    this.blueTeams = ['1580', '1937', '1943'];
    this.redTeams = ['2230', '3034', '3083'];
    this.allTeams = [...this.blueTeams, ...this.redTeams];
    this.gameNumber = '0';
    console.log(this.blueTeams);
    // this.dialog.open(DialogAlliancesComponent, dialogConfig)
    //   .afterClosed()
    //   .pipe(take(1))
    //   .subscribe(res => {
    //     this.blueTeams = res.blueTeams;
    //     this.redTeams = res.redTeams;
    //     this.allTeams = [...this.blueTeams, ...this.redTeams];
    //     this.gameNumber = '0';
    //   });
  }

  getGames(gameNumber: string) {
    this.isLoading = true;

    function getTheGame(games: ObservedValueOf<Observable<Game[]>>) {
      // tslint:disable-next-line:prefer-const
      let gameToReturn: Game = new Game();
      games.forEach((game: Game) => {
        // tslint:disable-next-line:triple-equals
        if (Number(game.gameNumber) == Number(gameNumber)) {
          gameToReturn = game;
        }
      });
      return gameToReturn;
    }

    zip(
      this.gameService.getGames(this.tournament, this.blueTeams[0]),
      this.gameService.getGames(this.tournament, this.blueTeams[1]),
      this.gameService.getGames(this.tournament, this.blueTeams[2]),
      this.gameService.getGames(this.tournament, this.redTeams[0]),
      this.gameService.getGames(this.tournament, this.redTeams[1]),
      this.gameService.getGames(this.tournament, this.redTeams[2]),
    )
      .subscribe(res => {
        // @ts-ignore
        this.gameBlue1 = getTheGame(res[0]);
        this.gameBlue2 = getTheGame(res[1]);
        this.gameBlue3 = getTheGame(res[2]);
        this.gameRed1 = getTheGame(res[3]);
        this.gameRed2 = getTheGame(res[4]);
        this.gameRed3 = getTheGame(res[5]);

        this.processedGamesBlue1 = this.gameService.processGames([this.gameBlue1]);
        this.processedGamesBlue2 = this.gameService.processGames([this.gameBlue2]);
        this.processedGamesBlue3 = this.gameService.processGames([this.gameBlue3]);
        this.processedGamesRed1 = this.gameService.processGames([this.gameRed1]);
        this.processedGamesRed2 = this.gameService.processGames([this.gameRed2]);
        this.processedGamesRed3 = this.gameService.processGames([this.gameRed3]);
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


