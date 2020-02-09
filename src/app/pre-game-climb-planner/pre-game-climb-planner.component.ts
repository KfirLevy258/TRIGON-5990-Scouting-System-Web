import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PitScouting, PitScoutingService} from '../pit-scouting.service';

const PIVOT_TO_RUNG = 48 * 2.54 * 0.01; // 48" [m]
const MASS = 93 * 0.453592; // [Kg]
const CENTER_OF_MASS_OFFSET = 26 * 2.54 * 0.01; // [m]

export class RobotClimbData {
  teamNumber: string;
  robotWeight: number;
  canCLimb: boolean;
  minClimbHHeight: number;
  maxClimbHeight: number;
  climbSuccessRate: number;
}

export class ClimbPlanRecord {
  robotClimbData: RobotClimbData;
  climbD: number;       // Distance from center. positive is right
}

@Component({
  selector: 'app-pre-game-climb-planner',
  templateUrl: './pre-game-climb-planner.component.html',
  styleUrls: ['./pre-game-climb-planner.component.scss']
})
export class PreGameClimbPlannerComponent implements OnInit, OnChanges {



  @Input() ourTeam: Array<string>;
  pitScouting: PitScouting;
  tournament: string;
  climbPlan: Array<ClimbPlanRecord> = [];

  displayedColumns: string[] = ['teamNumber', 'weight', 'distance', 'Actions'];

  constructor(private pitScoutingService: PitScoutingService) {
    // temp get data
    const robot1ClimbData: RobotClimbData = {
      teamNumber: '1000',
      robotWeight: 60,
      canCLimb: true,
      minClimbHHeight: 120,
      maxClimbHeight: 180,
      climbSuccessRate: 0.8
    };
    const robot1ClimbPlan: ClimbPlanRecord = {
      robotClimbData: robot1ClimbData,
      climbD: 10
    };
    const robot2ClimbData: RobotClimbData = {
      teamNumber: '2000',
      robotWeight: 70,
      canCLimb: true,
      minClimbHHeight: 120,
      maxClimbHeight: 180,
      climbSuccessRate: 0.8
    };
    const robot2ClimbPlan: ClimbPlanRecord = {
      robotClimbData: robot2ClimbData,
      climbD: -20
    };
    const robot3ClimbData: RobotClimbData = {
      teamNumber: '3000',
      robotWeight: 50,
      canCLimb: true,
      minClimbHHeight: 120,
      maxClimbHeight: 180,
      climbSuccessRate: 0.8
    };
    const robot3ClimbPlan: ClimbPlanRecord = {
      robotClimbData: robot3ClimbData,
      climbD: 30
    };

    this.climbPlan.push(robot1ClimbPlan);
    this.climbPlan.push(robot2ClimbPlan);
    this.climbPlan.push(robot3ClimbPlan);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tournament = localStorage.getItem('tournament');



    // this.pitScoutingService.getPitScoutingData$(this.tournament, this.ourTeam[0])
    //   .subscribe(pitData => {
    //     this.pitScouting = pitData;
    //     console.log(pitData);
    //   });
  }

  calcAngle(m1: number, d1: number, m2: number, d2: number, m3: number, d3: number) {

    return  Math.atan((m1 * d1 + m2 * d2 + m3 * d3) / ((m1 + m2 + m3) * PIVOT_TO_RUNG  + MASS * CENTER_OF_MASS_OFFSET)) ;

  }

  swap(element) {
    console.log(element);
  }

  changeDistance(element, event) {
    console.log(element);
    console.log(event);
  }
}
