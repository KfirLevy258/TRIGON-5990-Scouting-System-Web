import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {Game, GameService, ProcessedGames} from '../game.service';

@Component({
  selector: 'app-upper-hot-zones',
  templateUrl: './upper-hot-zones.component.html',
  styleUrls: ['./upper-hot-zones.component.scss']
})
export class UpperHotZonesComponent implements OnInit, OnChanges {

  @Input() tournament;
  @Input() teamNumber;

  @ViewChild('legend', {static: true}) legend: ElementRef;
  private legendCx: CanvasRenderingContext2D;
  @ViewChild('field', {static: true}) field: ElementRef;
  private fieldCx: CanvasRenderingContext2D;

  games$: Observable<Game[]>;
  games: Array<Game> = [];
  processedGames: ProcessedGames;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.legendCx = this.legend.nativeElement.getContext('2d');
    this.fieldCx = this.field.nativeElement.getContext('2d');
    this.drawLegend();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.legendCx) {
      this.legendCx.clearRect(0, 0, this.legend.nativeElement.width, this.legend.nativeElement.height);
      this.drawLegend();
    }
    if (this.fieldCx) {
      this.fieldCx.clearRect(0, 0, this.field.nativeElement.width, this.field.nativeElement.height);
    }

    this.games$ = this.gameService.getGames(this.tournament, this.teamNumber);
    this.games$
      .subscribe(res => {
        this.games = res;
        this.processedGames = this.gameService.processGames(res);
        this.processedGames.teleopDetailedUpperShots.forEach(shot => {
          this.drawShot(this.fieldCx, this.field, shot.x, shot.y, shot.innerScore + shot.outerScore, shot.shots);
        });
        this.drawGameField();
      });
  }

  drawLegend() {
    this.legendCx.textAlign = 'center';
    this.legendCx.fillText('Percentage', 60, 10);
    this.legendCx.fillText('0.8 - 1.0', 20, 40);
    this.legendCx.fillText('0.6 - 0.8', 20, 65);
    this.legendCx.fillText('0.4 - 0.6', 20, 90);
    this.legendCx.fillText('0.2 - 0.4', 20, 115);
    this.legendCx.fillText('0.0 - 0.2', 20, 140);

    this.legendCx.fillText('Shots', 120, 10);
    this.legendCx.fillText('5', 100, 40);
    this.legendCx.fillText('4', 100, 65);
    this.legendCx.fillText('3', 100, 90);
    this.legendCx.fillText('2', 100, 115);
    this.legendCx.fillText('1', 100, 140);

    this.drawShot(this.legendCx, this.legend, 0.4, 0.2, 5, 5);
    this.drawShot(this.legendCx, this.legend, 0.4, 0.325, 4, 5);
    this.drawShot(this.legendCx, this.legend, 0.4, 0.45, 3, 5);
    this.drawShot(this.legendCx, this.legend, 0.4, 0.565, 2, 5);
    this.drawShot(this.legendCx, this.legend, 0.4, 0.69, 1, 5);

    this.drawShot(this.legendCx, this.legend, 0.8, 0.2, 5, 5);
    this.drawShot(this.legendCx, this.legend, 0.8, 0.325, 4, 4);
    this.drawShot(this.legendCx, this.legend, 0.8, 0.45, 3, 3);
    this.drawShot(this.legendCx, this.legend, 0.8, 0.565, 2, 2);
    this.drawShot(this.legendCx, this.legend, 0.8, 0.69, 1, 1);

    this.legendCx.fillStyle = 'black';
  }

  drawGameField() {
    const width = this.field.nativeElement.width;
    const height = this.field.nativeElement.height;
    this.fieldCx.lineWidth = 3;
    this.fieldCx.lineCap = 'round';
    this.fieldCx.strokeStyle = '#000';

    this.fieldCx.beginPath();
    this.fieldCx.moveTo(0, 0);
    this.fieldCx.lineTo(width, 0);
    this.fieldCx.lineTo(width, height);
    this.fieldCx.lineTo(0, height);
    this.fieldCx.lineTo(0, 0);
    this.fieldCx.stroke();

  }

  drawShot(cx: CanvasRenderingContext2D, canvas: ElementRef, relativeX: number, relativeY: number, scored: number, shot: number) {
    const width = canvas.nativeElement.width;
    const height = canvas.nativeElement.height;
    const x = relativeX * width;
    const y = relativeY * height;
    const scorePct = scored / shot;

    cx.beginPath();
    cx.arc(x, y, 2 * shot, 0, 2 * Math.PI, false);
    if (scorePct > 0.8 && scorePct <= 1.0) { cx.fillStyle = '#f00000'; }
    if (scorePct > 0.6 && scorePct <= 0.8) { cx.fillStyle = '#c00000'; }
    if (scorePct > 0.4 && scorePct <= 0.6) { cx.fillStyle = '#a00000'; }
    if (scorePct > 0.2 && scorePct <= 0.4) { cx.fillStyle = '#800000'; }
    if (scorePct > 0 && scorePct <= 0.2) { cx.fillStyle = '#600000'; }

    cx.fill();
    cx.lineWidth = 1;
    cx.strokeStyle = '#003300';
    cx.stroke();
  }
}
