import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root'
})
export class PitScoutingService {

  constructor(private db: AngularFirestore) { }

  getPitScoutingData$(tournament: string, teamNumber: string): Observable<PitScouting> {
    console.log(tournament, teamNumber);
    return this.db.collection('tournaments').doc(tournament)
      .collection('teams').doc(teamNumber).snapshotChanges()
      .pipe(
        map(doc => {
          const pitScouting: PitScouting = new PitScouting();
          // pitScouting.powerCellsAtStartup = doc.pit_data.basic_ability.power_cells_at_start;
          // pitScouting.startAnywhere = doc.pit_data.basic_ability.start_from_everywhere;
          //
          // pitScouting.conversionRatio = doc.pit_data.chassis_overall_strength.conversion_ratio;
          // pitScouting.dtMotorType = doc.pit_data.chassis_overall_strength.dt_motor_type;
          // pitScouting.wheelDiameter = doc.pit_data.chassis_overall_strength.wheel_diameter;
          //
          // pitScouting.canClimb = doc.pit_data.end_game.can_climb;
          // pitScouting.climbHeight = doc.pit_data.end_game.climb_height;
          // pitScouting.maxClimb = doc.pit_data.end_game.max_climb;
          // pitScouting.minClimb = doc.pit_data.end_game.min_climb;
          //
          // pitScouting.powerCells = doc.pit_data.game.power_cells;
          // pitScouting.rotateRoulette = doc.pit_data.game.rotate_roulette;
          // pitScouting.stopRoulette = doc.pit_data.game.stop_roulette;
          //
          // pitScouting.dtMotors = doc.pit_data.robot_basic_data.dt_motors;
          // pitScouting.robotLength = doc.pit_data.robot_basic_data.robot_length;
          // pitScouting.robotWeight = doc.pit_data.robot_basic_data.robot_weight;
          // pitScouting.robotWidth = doc.pit_data.robot_basic_data.robot_width;
          return pitScouting;
        })
      );
  }
}
