import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class PitScouting {
  pitScoutingSaved: boolean;

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
          console.log(doc.payload.data());
          const docData: any = doc.payload.data();
          const pitScouting: PitScouting = new PitScouting();
          pitScouting.pitScoutingSaved = docData.pit_scouting_saved;
          if (docData.pit_scouting_saved) {
            pitScouting.powerCellsAtStartup = docData.pit_data.basic_ability.power_cells_at_start;
            pitScouting.startAnywhere = docData.pit_data.basic_ability.start_from_everywhere;

            pitScouting.conversionRatio = docData.pit_data.chassis_overall_strength.conversion_ratio;
            pitScouting.dtMotorType = docData.pit_data.chassis_overall_strength.dt_motor_type;
            pitScouting.wheelDiameter = docData.pit_data.chassis_overall_strength.wheel_diameter;

            pitScouting.canClimb = docData.pit_data.end_game.can_climb;
            pitScouting.climbHeight = docData.pit_data.end_game.climb_height;
            pitScouting.maxClimb = docData.pit_data.end_game.max_climb;
            pitScouting.minClimb = docData.pit_data.end_game.min_climb;

            pitScouting.powerCells = docData.pit_data.game.power_cells;
            pitScouting.rotateRoulette = docData.pit_data.game.rotate_roulette;
            pitScouting.stopRoulette = docData.pit_data.game.stop_roulette;

            pitScouting.dtMotors = docData.pit_data.robot_basic_data.dt_motors;
            pitScouting.robotLength = docData.pit_data.robot_basic_data.robot_length;
            pitScouting.robotWeight = docData.pit_data.robot_basic_data.robot_weight;
            pitScouting.robotWidth = docData.pit_data.robot_basic_data.robot_width;
          }

          return pitScouting;
        })
      );
  }
}
