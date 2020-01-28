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

  constructor(private fb: FormBuilder,
              private http: HttpClient) {
    this.qualNumberForm = fb.group({
      qualNumber: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }
  qualSelected() {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('X-TBA-Auth-Key', 'ptM95D6SCcHO95D97GLFStGb4cWyxtBKNOI9FX5QmBirDnjebphZAEpPcwXNr4vH');
    this.qualNumber = this.qualNumberForm.getRawValue().qualNumber;
    this.http.get('https://www.thebluealliance.com/api/v3/team/frc5990', {headers})
      .subscribe(res => {
        console.log(res);
      });
    console.log(this.qualNumber);
  }
}
