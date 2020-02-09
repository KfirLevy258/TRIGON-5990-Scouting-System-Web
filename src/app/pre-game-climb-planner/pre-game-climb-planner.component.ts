import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PitScouting, PitScoutingService} from '../pit-scouting.service';

@Component({
  selector: 'app-pre-game-climb-planner',
  templateUrl: './pre-game-climb-planner.component.html',
  styleUrls: ['./pre-game-climb-planner.component.scss']
})
export class PreGameClimbPlannerComponent implements OnInit, OnChanges {
  @Input() ourTeams: Array<string>;
  pitScouting: PitScouting;
  tournament: string;

  constructor(private pitScoutingService: PitScoutingService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tournament = localStorage.getItem('tournament');

    this.pitScoutingService.getPitScoutingData$(this.tournament, this.ourTeams[0])
      .subscribe(pitData => {
        console.log(pitData);
      });
  }

  calc(m1: number, d1: number, m2: number, d2: number, m3: number, d3: number) {
    const PIVOT_TO_RUNG = 48 * 2.54 * 0.01; // [m]
    const MASS = 93 * 0.453592; // [Kg]
    const CENTER_OF_MASS_OFFSET = 26 * 2.54 * 0.01; // [m]


    return  Math.atan((m1 * d1 + m2 * d2 + m3 * d3) / ((m1 + m2 + m3) * PIVOT_TO_RUNG  + MASS * CENTER_OF_MASS_OFFSET)) ;

  }
}
