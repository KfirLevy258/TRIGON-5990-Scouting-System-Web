import {Component, Input, OnInit} from '@angular/core';
import {ProcessedGames} from "../game.service";

@Component({
  selector: 'app-pre-game-summary',
  templateUrl: './pre-game-summary.component.html',
  styleUrls: ['./pre-game-summary.component.scss']
})
export class PreGameSummaryComponent implements OnInit {
  @Input() tournament: string;
  @Input() blue1: ProcessedGames;
  @Input() blue2: ProcessedGames;
  @Input() blue3: ProcessedGames;
  @Input() blueTeams: Array<string>;
  constructor() { }

  ngOnInit() {
  }

}
