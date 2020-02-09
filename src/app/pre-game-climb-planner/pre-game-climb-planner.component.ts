import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PitScouting, PitScoutingService} from '../pit-scouting.service';
import {zip} from 'rxjs';

const PIVOT_TO_RUNG = 48 * 2.54 * 0.01; // 48" [m]
const MASS = 93 * 0.453592; // [Kg]
const CENTER_OF_MASS_OFFSET = 26 * 2.54 * 0.01; // [m]

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
  climbD: number;       // Distance from center. positive is right
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

  tournament: string;
  climbPlan: Array<ClimbPlanRecord> = [];

  displayedColumns: string[] = ['teamNumber', 'weight', 'climbRange', 'distance', 'Actions'];

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
      });
  }

  genClimbPlan() {
    this.climbPlan = [];
    const robot1ClimbPlan: ClimbPlanRecord = {
      robotClimbData: this.genRobotClimbData(this.ourTeam[0], this.pitScouting1),
      climbD: 0
    };
    this.climbPlan.push(robot1ClimbPlan);
    const robot2ClimbPlan: ClimbPlanRecord = {
      robotClimbData: this.genRobotClimbData(this.ourTeam[1], this.pitScouting2),
      climbD: 0
    };
    this.climbPlan.push(robot2ClimbPlan);
    const robot3ClimbPlan: ClimbPlanRecord = {
      robotClimbData: this.genRobotClimbData(this.ourTeam[2], this.pitScouting3),
      climbD: 0
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

    return  Math.atan((m1 * d1 + m2 * d2 + m3 * d3) / ((m1 + m2 + m3) * PIVOT_TO_RUNG  + MASS * CENTER_OF_MASS_OFFSET)) ;

  }

  swapDown(rowIndex) {
    const climbPlan: Array<ClimbPlanRecord> = [];
    if (rowIndex === 0) {
      climbPlan.push(this.climbPlan[1]);
      climbPlan.push(this.climbPlan[0]);
      climbPlan.push(this.climbPlan[2]);

    } else { // rowIndex ===1
      climbPlan.push(this.climbPlan[0]);
      climbPlan.push(this.climbPlan[2]);
      climbPlan.push(this.climbPlan[1]);
    }
    this.climbPlan = climbPlan;
  }

  changeDistance(element, event) {
    console.log(element);
    console.log(event);
  }
}
