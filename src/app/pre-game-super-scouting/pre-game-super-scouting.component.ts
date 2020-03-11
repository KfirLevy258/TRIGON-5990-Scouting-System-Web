import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-pre-game-super-scouting',
  templateUrl: './pre-game-super-scouting.component.html',
  styleUrls: ['./pre-game-super-scouting.component.scss']
})
export class PreGameSuperScoutingComponent implements OnInit {

  @Input() tournament;
  @Input() blueTeams;
  @Input() redTeams;

  constructor() { }

  ngOnInit() {
  }

}
