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
  dtMotors: number;
  robotLength: number;
  robotWeight: number;
  robotWidth: number;

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getData();
  }

  getData() {
    this.db.collection('tournaments').doc(this.tournament)
      .collection('teams').doc(this.teamNumber).valueChanges()
      .subscribe((res: any) => {
        if (res) {
          this.pitScoutingSaved = res.pit_scouting_saved;
          if (this.pitScoutingSaved) {
            this.dtMotors = res['DT Motors'];
            this.robotLength = res['Robot Length'];
            this.robotWeight = res['Robot Weight'];
            this.robotWidth = res['Robot Width'];

            console.log(this.robotWidth, this.robotLength, this.robotWeight);
          }
        }


      });
  }
}
