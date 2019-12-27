import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import {createPerformWatchHost} from '@angular/compiler-cli/src/perform_watch';

@Component({
  selector: 'app-pit-scouting-page',
  templateUrl: './pit-scouting-page.component.html',
  styleUrls: ['./pit-scouting-page.component.scss']
})
export class PitScoutingPageComponent implements OnInit, OnChanges {
  @Input() tournament;
  @Input() teamNumber;

  pitScoutingSaved: boolean;
  robotLength: number;
  robotWeight: number;
  robotWidth: number;

  dtMotors: Array<Array<any>> = [];
  dtMotorsOptions = {
    min: 0,
    max: 4,
    redFrom: 3,
    redTo: 4,
    yellowFrom: 2,
    yellowTo: 3,
    minorTicks: 1,
    width: 180, height: 180,
  };
  robotDimensions: Array<Array<any>> = [];
  robotDimensionsOptions = {
    min: 0,
    max: 200,
    redFrom: 160,
    redTo: 200,
    yellowFrom: 120,
    yellowTo: 160,
    minorTicks: 10,
    width: 540, height: 180,
  };

  driveTrain: string;
  dtMotorType: string;
  programmingLanguage: string;
  wheelType: string;

  hasCamera: boolean;
  isPanelSpeclist: boolean;

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.pitScoutingSaved = false;
    this.getData();

  }

  getData() {
    this.db.collection('tournaments').doc(this.tournament)
      .collection('teams').doc(this.teamNumber).valueChanges()
      .subscribe((res: any) => {
        if (res) {
          this.pitScoutingSaved = res.pit_scouting_saved;
          if (this.pitScoutingSaved) {
            this.robotLength = res['Robot Length'];
            this.robotWeight = res['Robot Weight'];
            this.robotWidth = res['Robot Width'];
            this.dtMotors = [];
            this.dtMotors.push(['DT Motors', res['DT Motors']]);
            this.robotDimensions = [];
            this.robotDimensions.push(
              ['Robot Length', res['Robot Length']],
              ['Robot Weight', res['Robot Weight']],
              ['Robot Width', res['Robot Width']],
            );
            this.driveTrain = res['Drive Train'];
            this.wheelType = res['Wheel Type'];
            this.dtMotorType = res['DT Motor type'];
            this.programmingLanguage = res['Programming Language'];

            this.hasCamera = res['Has Camera'];
            this.isPanelSpeclist = res['is Panel Speclist'];

            console.log(this.hasCamera, this.isPanelSpeclist);
          }
        }


      });
  }
}
