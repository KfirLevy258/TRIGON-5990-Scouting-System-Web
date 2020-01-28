import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AngularFirestore} from '@angular/fire/firestore';

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
              private http: HttpClient,
              private db: AngularFirestore) {
    this.qualNumberForm = fb.group({
      qualNumber: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.eventKey = localStorage.getItem('event_key');
  }
  getTeamAverageScore(teamNumber: string) {
    this.db.collection('tournaments').doc(localStorage.getItem('tournament'))
      .collection('teams').doc(teamNumber).get().subscribe((res: any) => {
      console.log(res);
    });
    // .valueChanges()
    // .subscribe((res: any) => {
    //   if (res) {
    //     this.pitScoutingSaved = res.pit_scouting_saved;
    //     if (this.pitScoutingSaved) {
    //       this.robotLength = res['pit_data']['robot_basic_data']['robot_length'];
    //       this.robotWeight = res['pit_data']['robot_basic_data']['robot_weight'];
    //       this.robotWidth = res['pit_data']['robot_basic_data']['robot_width'];
    //       this.dtMotors = [];
    //       this.dtMotors.push(['DT Motors', Number(res['pit_data']['robot_basic_data']['dt_motors'])]);
    //       // this.dtMotors.push(['aaa', 4]);
    //       console.log(this.dtMotors);
    //       this.robotDimensions = [];
    //       this.robotDimensions.push(
    //         ['Robot Length', res['pit_data']['robot_basic_data']['robot_length']],
    //         ['Robot Weight', res['pit_data']['robot_basic_data']['robot_weight']],
    //         ['Robot Width', res['pit_data']['robot_basic_data']['robot_width']],
    //       );
    //     }
    //   }
  }
  qualSelected() {
    this.qualNumber = this.qualNumberForm.getRawValue().qualNumber;

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('X-TBA-Auth-Key', 'ptM95D6SCcHO95D97GLFStGb4cWyxtBKNOI9FX5QmBirDnjebphZAEpPcwXNr4vH');
    this.http.get('https://www.thebluealliance.com/api/v3/match/' + this.eventKey + '_qm' + this.qualNumber, {headers})
      .subscribe((matchData: any) => {
        this.blueTeams = matchData.alliances.blue.team_keys;
        this.readTeams = matchData.alliances.red.team_keys;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.blueTeams.length; i++) {
          this.readTeams[i] = (this.readTeams[i].substring(3, 10));
        }
        console.log(this.readTeams);
        this.getTeamAverageScore(this.readTeams[1]);
      });
    console.log(this.qualNumber);
  }
}
