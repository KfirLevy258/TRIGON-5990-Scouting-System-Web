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
        this.pitScoutingSaved = res.pit_scouting_saved;
        this.pitScouting = res.pitScouting;
        console.log(this.pitScouting);
      })
    // this.db.collection('tournaments').doc(this.tournament)
    //   .collection('teams').doc(this.teamNumber).valueChanges()
    //   .subscribe((res: any) => {
    //     if (res) {
    //       this.pitScoutingSaved = res.pit_scouting_saved;
    //       if (this.pitScoutingSaved) {
    //         this.pitScouting.powerCellsAtStartup = res.pit_data.basic_ability.power_cells_at_start;
    //         this.pitScouting.startAnywhere = res.pit_data.basic_ability.start_from_everywhere;
    //
    //         this.pitScouting.conversionRatio = res.pit_data.chassis_overall_strength.conversion_ratio;
    //         this.pitScouting.dtMotorType = res.pit_data.chassis_overall_strength.dt_motor_type;
    //         this.pitScouting.wheelDiameter = res.pit_data.chassis_overall_strength.wheel_diameter;
    //
    //         this.pitScouting.canClimb = res.pit_data.end_game.can_climb;
    //         this.pitScouting.climbHeight = res.pit_data.end_game.climb_height;
    //         this.pitScouting.maxClimb = res.pit_data.end_game.max_climb;
    //         this.pitScouting.minClimb = res.pit_data.end_game.min_climb;
    //
    //         this.pitScouting.powerCells = res.pit_data.game.power_cells;
    //         this.pitScouting.rotateRoulette = res.pit_data.game.rotate_roulette;
    //         this.pitScouting.stopRoulette = res.pit_data.game.stop_roulette;
    //
    //         this.pitScouting.dtMotors = res.pit_data.robot_basic_data.dt_motors;
    //         this.pitScouting.robotLength = res.pit_data.robot_basic_data.robot_length;
    //         this.pitScouting.robotWeight = res.pit_data.robot_basic_data.robot_weight;
    //         this.pitScouting.robotWidth = res.pit_data.robot_basic_data.robot_width;
    //       }
    //     }
    //   });
  }
}
