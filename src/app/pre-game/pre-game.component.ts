import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-pre-game',
  templateUrl: './pre-game.component.html',
  styleUrls: ['./pre-game.component.scss']
})
export class PreGameComponent implements OnInit {
  qualNumberForm: FormGroup;
  qualNumber: string;
  eventKey: string;
  blueTeams: Array<string> = [];
  readTeams: Array<string> = [];

  constructor(private fb: FormBuilder,
              private http: HttpClient) {
    this.qualNumberForm = fb.group({
      qualNumber: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.eventKey = localStorage.getItem('event_key');
  }
  qualSelected() {
    this.qualNumber = this.qualNumberForm.getRawValue().qualNumber;

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('X-TBA-Auth-Key', 'ptM95D6SCcHO95D97GLFStGb4cWyxtBKNOI9FX5QmBirDnjebphZAEpPcwXNr4vH');
    this.http.get('https://www.thebluealliance.com/api/v3/match/' + this.eventKey + '_qm' + this.qualNumber, {headers})
      .subscribe((matchData: any) => {
        this.blueTeams = matchData.alliances.blue.team_keys;
        this.readTeams = matchData.alliances.red.team_keys;

        console.log(this.readTeams);
      });
    console.log(this.qualNumber);
  }
}
