import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {PitScouting, PitScoutingService} from '../pit-scouting.service';



@Component({
  selector: 'app-pit-scouting-page',
  templateUrl: './team-pit-scouting.component.html',
  styleUrls: ['./team-pit-scouting.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class TeamPitScouting implements OnInit, OnChanges {
  @Input() tournament;
  @Input() teamNumber;


  pitScouting: PitScouting = new PitScouting();
  pitScoutingSaved: boolean;

  // robotLength: number;
  // robotWeight: number;
  // robotWidth: number;

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


  constructor(private db: AngularFirestore,
              private pitScoutingService: PitScoutingService) { }

  ngOnInit() {
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.pitScoutingSaved = false;
    this.getData();

  }

  getData() {
    this.pitScoutingService.getPitScoutingData$(this.tournament, this.teamNumber)
      .subscribe((res: any) => {
        this.pitScoutingSaved = res.pitScoutingSaved;
        this.pitScouting = res;
      });
  }
}
