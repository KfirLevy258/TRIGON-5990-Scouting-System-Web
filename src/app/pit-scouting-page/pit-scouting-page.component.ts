import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import {createPerformWatchHost} from '@angular/compiler-cli/src/perform_watch';

export class PitScouting {
  powerCellsAtStartup: string;
  startAnywhere: boolean;

  conversionRatio: string;
  dtMotorType: string;
  wheelDiameter: string;

  canClimb: boolean;
  climbHeight: string;
  maxClimb: string;
  minClimb: string;

  powerCells: string;
  rotateRoulette: boolean;
  stopRoulette: boolean;

  dtMotors: string;
  robotLength: string;
  robotWeight: string;
  robotWidth: string;
}

@Component({
  selector: 'app-pit-scouting-page',
  templateUrl: './pit-scouting-page.component.html',
  styleUrls: ['./pit-scouting-page.component.scss']
})
export class PitScoutingPageComponent implements OnInit, OnChanges {
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
            this.pitScouting.powerCellsAtStartup = res.pit_data.basic_ability.power_cells_at_start;
            this.pitScouting.startAnywhere = res.pit_data.basic_ability.start_from_everywhere;

            this.pitScouting.conversionRatio = res.pit_data.chassis_overall_strength.conversion_ratio;
            this.pitScouting.dtMotorType = res.pit_data.chassis_overall_strength.dt_motor_type;
            this.pitScouting.wheelDiameter = res.pit_data.chassis_overall_strength.wheel_diameter;

            this.pitScouting.canClimb = res.pit_data.end_game.can_climb;
            this.pitScouting.climbHeight = res.pit_data.end_game.climb_height;
            this.pitScouting.maxClimb = res.pit_data.end_game.max_climb;
            this.pitScouting.minClimb = res.pit_data.end_game.min_climb;

            this.pitScouting.powerCells = res.pit_data.game.power_cells;
            this.pitScouting.rotateRoulette = res.pit_data.game.rotate_roulette;
            this.pitScouting.stopRoulette = res.pit_data.game.stop_roulette;

            this.pitScouting.dtMotors = res.pit_data.robot_basic_data.dt_motors;
            this.pitScouting.robotLength = res.pit_data.robot_basic_data.robot_length;
            this.pitScouting.robotWeight = res.pit_data.robot_basic_data.robot_weight;
            this.pitScouting.robotWidth = res.pit_data.robot_basic_data.robot_width;

            console.log(this.pitScouting);
            // this.robotLength = res['pit_data']['robot_basic_data']['robot_length'];
            // this.robotWeight = res['pit_data']['robot_basic_data']['robot_weight'];
            // this.robotWidth = res['pit_data']['robot_basic_data']['robot_width'];
            // this.dtMotors = [];
            // this.dtMotors.push(['DT Motors', Number(res['pit_data']['robot_basic_data']['dt_motors'])]);
            // // this.dtMotors.push(['aaa', 4]);
            // console.log(this.dtMotors);
            // this.robotDimensions = [];
            // this.robotDimensions.push(
            //   ['Robot Length', res['pit_data']['robot_basic_data']['robot_length']],
            //   ['Robot Weight', res['pit_data']['robot_basic_data']['robot_weight']],
            //   ['Robot Width', res['pit_data']['robot_basic_data']['robot_width']],
            // );
          }
        }


      });
  }
}
