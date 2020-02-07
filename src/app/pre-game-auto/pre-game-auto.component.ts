import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-pre-game-auto',
  templateUrl: './pre-game-auto.component.html',
  styleUrls: ['./pre-game-auto.component.scss']
})
export class PreGameAutoComponent implements OnInit {

  @Input() tournament: string;
  @Input() teamNumber: string;


  constructor() { }

  ngOnInit() {
  }

}
