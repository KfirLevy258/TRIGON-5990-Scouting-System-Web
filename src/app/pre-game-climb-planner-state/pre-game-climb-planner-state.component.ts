import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SwingState} from '../pre-game-climb-planner/pre-game-climb-planner.component';

const BAR_HALF_LENGTH_PX = 140;
const BAR_HALF_SIZE = 55 * 2.54 * 0.01; // 55" [m]

@Component({
  selector: 'app-pre-game-climb-planner-state',
  templateUrl: './pre-game-climb-planner-state.component.html',
  styleUrls: ['./pre-game-climb-planner-state.component.scss']
})
export class PreGameClimbPlannerStateComponent implements OnInit, OnChanges {

  @Input() swingState: SwingState;
  @ViewChild('canvas', {static: true}) canvas: ElementRef;
  private cx: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cx = this.canvas.nativeElement.getContext('2d');

    this.draw(this.swingState.barAngle, this.swingState.d1, this.swingState.d2, this.swingState.d3);
  }

  draw(angle: number, d1: number, d2: number, d3: number) {

    if (d2 === d1) {d2 = d1 + 0.1; }
    if (d3 === d1) {d3 = d1 + 0.1; }
    if (d3 === d2) {d3 = d2 + 0.1; }

    this.cx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.drawBarAndEarth(angle);

    this.drawRobot(1, d1, this.swingState.up1, angle);
    this.drawRobot(2, d2, this.swingState.up2, angle);
    this.drawRobot(3, d3, this.swingState.up3, angle);


  }

  drawBarAndEarth(angle: number) {
    // bar
    this.cx.beginPath();
    this.cx.moveTo(150 - BAR_HALF_LENGTH_PX * Math.cos(angle), 50 + BAR_HALF_LENGTH_PX * Math.sin(angle));
    this.cx.lineTo(150 + BAR_HALF_LENGTH_PX * Math.cos(angle), 50 - BAR_HALF_LENGTH_PX * Math.sin(angle));
    this.cx.stroke();

    this.cx.beginPath();
    this.cx.arc(150 , 50, 3, 0, 2 * Math.PI, false);
    this.cx.fillStyle = 'black';
    this.cx.fill();
    this.cx.lineWidth = 1;
    this.cx.strokeStyle = '#003300';
    this.cx.stroke();

    // earth, has same length as bar
    this.cx.beginPath();
    this.cx.moveTo(150 - BAR_HALF_LENGTH_PX, 158);
    this.cx.lineTo(150 + BAR_HALF_LENGTH_PX, 158);
    this.cx.stroke();
  }

  drawRobot(robotNumber: number, d: number, hasClimbed: boolean, barAngle: number) {
    const y = hasClimbed ? 50 - d / BAR_HALF_SIZE *  BAR_HALF_LENGTH_PX * Math.sin(barAngle) : 150;
    this.cx.beginPath();
    this.cx.arc(150 + d / BAR_HALF_SIZE * BAR_HALF_LENGTH_PX * Math.cos(barAngle), y,
      10, 0, 2 * Math.PI, false);
    switch (robotNumber) {
      case 1: {
        this.cx.fillStyle = 'blue';
        break;
      }
      case 2: {
        this.cx.fillStyle = 'green';
        break;
      }
      case 3: {
        this.cx.fillStyle = 'red';
        break;
      }
    }
    this.cx.fill();
    this.cx.lineWidth = 1;
    this.cx.strokeStyle = '#003300';
    this.cx.stroke();
  }
}
