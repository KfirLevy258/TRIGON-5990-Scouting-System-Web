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
    max: 13,
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
            this.robotLength = res['pit_data']['robot_basic_data']['robot_length'];
            this.robotWeight = res['pit_data']['robot_basic_data']['robot_weight'];
            this.robotWidth = res['pit_data']['robot_basic_data']['robot_width'];
            this.dtMotors = [];
            this.dtMotors.push(['DT Motors', Number(res['pit_data']['robot_basic_data']['dt_motors'])]);
            // this.dtMotors.push(['aaa', 4]);
            console.log(this.dtMotors);
            this.robotDimensions = [];
            this.robotDimensions.push(
              ['Robot Length', res['pit_data']['robot_basic_data']['robot_length']],
              ['Robot Weight', res['pit_data']['robot_basic_data']['robot_weight']],
              ['Robot Width', res['pit_data']['robot_basic_data']['robot_width']],
            );
          }
        }


      });
  }
}
