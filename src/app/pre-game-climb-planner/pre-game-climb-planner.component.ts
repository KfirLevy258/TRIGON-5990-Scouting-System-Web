import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PitScouting, PitScoutingService} from '../pit-scouting.service';
import {zip} from 'rxjs';

const PIVOT_TO_RUNG = 48 * 2.54 * 0.01; // 48" [m]
const MASS = 93 * 0.453592; // [Kg]
const CENTER_OF_MASS_OFFSET = 26 * 2.54 * 0.01; // [m]
const BAR_HALF_SIZE = 55 * 2.54 * 0.01; // 55" [m]
const BAR_LEVEL_HEIGHT = 1.6; // [m]

export class RobotClimbData {
  teamNumber: string;
  robotWeight: number;
  canClimb: boolean;
  minClimbHeight: number;
  maxClimbHeight: number;
  climbSuccessRate: number;
}

export class ClimbPlanRecord {
  robotClimbData: RobotClimbData;
  climbDistance: number;       // Distance from center. positive is right [m]
}

export class SwingState {
  success: boolean;
  barAngle: number;
  up1: boolean;
  d1: number;
  up2: boolean;
  d2: number;
  up3: boolean;
  d3: number;
}

@Component({
  selector: 'app-pre-game-climb-planner',
  templateUrl: './pre-game-climb-planner.component.html',
  styleUrls: ['./pre-game-climb-planner.component.scss']
})
export class PreGameClimbPlannerComponent implements OnInit, OnChanges {



  @Input() ourTeam: Array<string>;
  pitScouting1: PitScouting;
  pitScouting2: PitScouting;
  pitScouting3: PitScouting;

  state0: SwingState = new SwingState();
  state1: SwingState = new SwingState();
  state2: SwingState = new SwingState();
  state3: SwingState = new SwingState();

  tournament: string;
  climbPlan: Array<ClimbPlanRecord> = [];

  displayedColumns: string[] = ['teamNumber', 'weight', 'climbRange', 'distance', 'Actions', 'result'];

  constructor(private pitScoutingService: PitScoutingService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tournament = localStorage.getItem('tournament');

    zip(
      this.pitScoutingService.getPitScoutingData$(this.tournament, this.ourTeam[0]),
      this.pitScoutingService.getPitScoutingData$(this.tournament, this.ourTeam[1]),
      this.pitScoutingService.getPitScoutingData$(this.tournament, this.ourTeam[2]),
    )
      .subscribe(res => {
        this.pitScouting1 = res[0];
        this.pitScouting2 = res[1];
        this.pitScouting3 = res[2];
        this.genClimbPlan();
        this.calcStates();
      });
  }

  genClimbPlan() {
    this.climbPlan = [];
    const robot1ClimbPlan: ClimbPlanRecord = {
      robotClimbData: this.genRobotClimbData(this.ourTeam[0], this.pitScouting1),
      climbDistance: -0.5
    };
    this.climbPlan.push(robot1ClimbPlan);
    const robot2ClimbPlan: ClimbPlanRecord = {
      robotClimbData: this.genRobotClimbData(this.ourTeam[1], this.pitScouting2),
      climbDistance: -0.5
    };
    this.climbPlan.push(robot2ClimbPlan);
    const robot3ClimbPlan: ClimbPlanRecord = {
      robotClimbData: this.genRobotClimbData(this.ourTeam[2], this.pitScouting3),
      climbDistance: 0
    };
    this.climbPlan.push(robot3ClimbPlan);
  }

  genRobotClimbData(teamNumber: string, pitScouting: PitScouting) {
    const robotClimbData: RobotClimbData = {
      teamNumber,
      robotWeight: Number(pitScouting.robotWeight),
      canClimb: pitScouting.canClimb,
      minClimbHeight: Number(pitScouting.minClimb),
      maxClimbHeight: Number(pitScouting.maxClimb),
      climbSuccessRate: 0.8       // ToDo - get actual number
    };
    return robotClimbData;
  }

  calcAngle(m1: number, d1: number, m2: number, d2: number, m3: number, d3: number) {

    return  -Math.atan((m1 * d1 + m2 * d2 + m3 * d3) / ((m1 + m2 + m3) * PIVOT_TO_RUNG  + MASS * CENTER_OF_MASS_OFFSET)) ;

  }

  calcStates() {
    this.state0 = {
      success: true,
      barAngle: 0,
      up1: false,
      up2: false,
      up3: false,
      d1: this.climbPlan[0].climbDistance / BAR_HALF_SIZE,
      d2: this.climbPlan[1].climbDistance / BAR_HALF_SIZE,
      d3: this.climbPlan[2].climbDistance / BAR_HALF_SIZE
    };
    this.state1 = this.calcState(1, this.state0);
    this.state2 = this.calcState(2, this.state1);
    this.state3 = this.calcState(3, this.state2);
  }

  calcState(stage: number, prevState: SwingState): SwingState {
    const stagePlan: ClimbPlanRecord = this.climbPlan[stage - 1];
    const climbHeight = (BAR_LEVEL_HEIGHT + stagePlan.climbDistance * Math.tan(prevState.barAngle)) * 100; // in [cm]

    const nextState: SwingState = new SwingState();
    nextState.success = stagePlan.robotClimbData.canClimb &&
      stagePlan.robotClimbData.minClimbHeight < climbHeight &&
      stagePlan.robotClimbData.maxClimbHeight > climbHeight;

    // console.log(stage, prevState.barAngle / Math.PI * 180, climbHeight,  stagePlan.robotClimbData.canClimb,
    //   stagePlan.robotClimbData.minClimbHeight, stagePlan.robotClimbData.maxClimbHeight,  nextState.success);
    nextState.up1 = prevState.up1;
    nextState.up2 = prevState.up2;
    nextState.up3 = prevState.up3;

    switch (stage) {
      case 1: {
        nextState.up1 = nextState.success;
        break;
      }
      case 2: {
        nextState.up2 = nextState.success;
        break;
      }
      case 3: {
        nextState.up3 = nextState.success;
        break;
      }
    }

    nextState.d1 = prevState.d1;
    nextState.d2 = prevState.d2;
    nextState.d3 = prevState.d3;

    const m1 = nextState.up1 ? this.climbPlan[0].robotClimbData.robotWeight : 0;
    const m2 = nextState.up2 ? this.climbPlan[1].robotClimbData.robotWeight : 0;
    const m3 = nextState.up3 ? this.climbPlan[2].robotClimbData.robotWeight : 0;

    nextState.barAngle = this.calcAngle(m1, nextState.d1, m2, nextState.d2, m3, nextState.d3);
    return nextState;
  }

  swapDown(rowIndex) {
    const climbPlan: Array<ClimbPlanRecord> = [];
    if (rowIndex === 0) {
      climbPlan.push(this.climbPlan[1]);
      climbPlan.push(this.climbPlan[0]);
      climbPlan.push(this.climbPlan[2]);

    } else { // rowIndex === 1
      climbPlan.push(this.climbPlan[0]);
      climbPlan.push(this.climbPlan[2]);
      climbPlan.push(this.climbPlan[1]);
    }
    this.climbPlan = climbPlan;
    this.calcStates();
  }

  changeDistance(rowIndex, event) {
    console.log(rowIndex);
    console.log(event.target.value);
    this.climbPlan[rowIndex].climbDistance = event.target.value / 100;
    this.calcStates();
  }
}
