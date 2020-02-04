import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AngularFirestore} from '@angular/fire/firestore';
import {defaultDialogConfig} from '../default-dialog-config';
import {MatDialog} from '@angular/material';
import {DialogAlertComponent} from '../dialog-alert/dialog-alert.component';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-pre-game',
  templateUrl: './pre-game.component.html',
  styleUrls: ['./pre-game.component.scss']
})
export class PreGameComponent implements OnInit {
  gameNumberForm: FormGroup;
  gameNumber: string;
  eventKey: string;
  blueTeams: Array<string> = [];
  redTeams: Array<string> = [];

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private dialog: MatDialog,
              private db: AngularFirestore) {
    this.gameNumberForm = fb.group({
      gameNumber: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.eventKey = localStorage.getItem('event_key');
  }

  gameSelected() {
    this.gameNumber = this.gameNumberForm.getRawValue().gameNumber;
    this.getTeams();

  }

  getTeams() {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: 'Pre Game',
      message: 'invalid game number'
    };

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('X-TBA-Auth-Key', 'ptM95D6SCcHO95D97GLFStGb4cWyxtBKNOI9FX5QmBirDnjebphZAEpPcwXNr4vH');
    this.http.get('https://www.thebluealliance.com/api/v3/match/' + this.eventKey + '_qm' + this.gameNumber, {headers})
      .subscribe((matchData: any) => {
        if (matchData) {
          this.blueTeams = matchData.alliances.blue.team_keys;
          this.redTeams = matchData.alliances.red.team_keys;
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.blueTeams.length; i++) {
            this.redTeams[i] = (this.redTeams[i].substring(3, 10));
            this.blueTeams[i] = (this.blueTeams[i].substring(3, 10));
          }
        }
      }, () => {
        this.dialog.open(DialogAlertComponent, dialogConfig)
          .afterClosed()
          .pipe(take(1))
          .subscribe();
      });
  }
}
