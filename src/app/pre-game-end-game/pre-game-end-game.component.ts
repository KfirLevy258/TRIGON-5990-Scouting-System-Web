import {Component, Input, OnInit} from '@angular/core';
import {ProcessedGames} from "../game.service";

@Component({
  selector: 'app-pre-game-end-game',
  templateUrl: './pre-game-end-game.component.html',
  styleUrls: ['./pre-game-end-game.component.scss']
})
export class PreGameEndGameComponent implements OnInit {
  @Input() tournament: string;
  @Input() blue1: ProcessedGames;
  @Input() blue2: ProcessedGames;
  @Input() blue3: ProcessedGames;
  @Input() blueTeams: Array<string>;

  constructor() { }

  ngOnInit() {

  }

}
