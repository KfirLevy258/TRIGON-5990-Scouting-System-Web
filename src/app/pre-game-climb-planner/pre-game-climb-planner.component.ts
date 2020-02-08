import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-pre-game-climb-planner',
  templateUrl: './pre-game-climb-planner.component.html',
  styleUrls: ['./pre-game-climb-planner.component.scss']
})
export class PreGameClimbPlannerComponent implements OnInit {
  @Input() ourTeams: Array<string>;

  constructor() { }

  ngOnInit() {
  }

}
