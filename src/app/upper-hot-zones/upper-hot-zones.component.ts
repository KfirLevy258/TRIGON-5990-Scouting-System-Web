import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {zip} from 'rxjs';
import {Game, GameService, ProcessedGames} from '../game.service';

@Component({
  selector: 'app-upper-hot-zones',
  templateUrl: './upper-hot-zones.component.html',
  styleUrls: ['./upper-hot-zones.component.scss']
})
export class UpperHotZonesComponent implements OnInit, OnChanges {

  // display hot zones for: 1 team; 3 teams (blue alliance); 6 teams (blue alliance & red alliance)
  @Input() tournament;
  @Input() teamNumbers: Array<string>;


  @ViewChild('legend', {static: true}) legend: ElementRef;
  private legendCx: CanvasRenderingContext2D;
  @ViewChild('field', {static: true}) field: ElementRef;
  private fieldCx: CanvasRenderingContext2D;

  games: Array<Array<Game>> = [];
  processedGames: Array<ProcessedGames>;
  team2Display: number;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.legendCx = this.legend.nativeElement.getContext('2d');
    this.fieldCx = this.field.nativeElement.getContext('2d');
    this.drawLegend();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.team2Display = this.teamNumbers.length;
    this.games = [];
    this.processedGames = [];
    if (this.legendCx) {
      this.legendCx.clearRect(0, 0, this.legend.nativeElement.width, this.legend.nativeElement.height);
      this.drawLegend();
    }
    if (this.fieldCx) {
      this.fieldCx.clearRect(0, 0, this.field.nativeElement.width, this.field.nativeElement.height);

    }

    let gamesQuery;
    switch (this.team2Display) {
      case 1:
        gamesQuery = zip(
          this.gameService.getGames(this.tournament, this.teamNumbers[0]),
        );
        break;
      case 3:
        gamesQuery = zip(
          this.gameService.getGames(this.tournament, this.teamNumbers[0]),
          this.gameService.getGames(this.tournament, this.teamNumbers[1]),
          this.gameService.getGames(this.tournament, this.teamNumbers[2]),
        );
        break;
      case 6:
        gamesQuery = zip(
          this.gameService.getGames(this.tournament, this.teamNumbers[0]),
          this.gameService.getGames(this.tournament, this.teamNumbers[1]),
          this.gameService.getGames(this.tournament, this.teamNumbers[2]),
          this.gameService.getGames(this.tournament, this.teamNumbers[3]),
          this.gameService.getGames(this.tournament, this.teamNumbers[4]),
          this.gameService.getGames(this.tournament, this.teamNumbers[5]),
        );
        break;
    }
    gamesQuery
      .subscribe(res => {

        // tslint:disable-next-line:forin
        for (const i in res) {
          this.games.push(res[i]);
          this.processedGames.push(this.gameService.processGames(res[i]));
          this.processedGames[i].teleopDetailedUpperShots.forEach(shot => {
            if (Number(i) < 3) {
              this.drawShot(this.fieldCx, this.field, shot.x, shot.y, shot.innerScore + shot.outerScore, shot.shots, Number(i));
            } else {
              this.drawShot(this.fieldCx, this.field, 1 - shot.x, 1 - shot.y, shot.innerScore + shot.outerScore, shot.shots, Number(i));
            }
          });
        }
        this.drawGameField();

      });
  }

  drawLegend() {
    this.legendCx.textAlign = 'center';
    this.legendCx.fillText('Percentage', 80, 10);
    this.legendCx.fillText('0.8 - 1.0', 20, 40);
    this.legendCx.fillText('0.6 - 0.8', 20, 65);
    this.legendCx.fillText('0.4 - 0.6', 20, 90);
    this.legendCx.fillText('0.2 - 0.4', 20, 115);
    this.legendCx.fillText('0.0 - 0.2', 20, 140);

    this.legendCx.fillText('Shots', 160, 10);
    this.legendCx.fillText('5', 140, 40);
    this.legendCx.fillText('4', 140, 65);
    this.legendCx.fillText('3', 140, 90);
    this.legendCx.fillText('2', 140, 115);
    this.legendCx.fillText('1', 140, 140);

    this.drawShot(this.legendCx, this.legend, 0.4, 0.2, 5, 5, 0);
    this.drawShot(this.legendCx, this.legend, 0.4, 0.325, 4, 5, 0);
    this.drawShot(this.legendCx, this.legend, 0.4, 0.45, 3, 5, 0);
    this.drawShot(this.legendCx, this.legend, 0.4, 0.565, 2, 5, 0);
    this.drawShot(this.legendCx, this.legend, 0.4, 0.69, 1, 5, 0);

    if (this.team2Display === 3) {
      this.legendCx.fillText(this.teamNumbers[0], 80, 20);
      this.legendCx.fillText(this.teamNumbers[1], 50, 20);
      this.legendCx.fillText(this.teamNumbers[2], 110, 20);

      this.drawShot(this.legendCx, this.legend, 0.3, 0.2, 5, 5, 1);
      this.drawShot(this.legendCx, this.legend, 0.3, 0.325, 4, 5, 1);
      this.drawShot(this.legendCx, this.legend, 0.3, 0.45, 3, 5, 1);
      this.drawShot(this.legendCx, this.legend, 0.3, 0.565, 2, 5, 1);
      this.drawShot(this.legendCx, this.legend, 0.3, 0.69, 1, 5, 1);

      this.drawShot(this.legendCx, this.legend, 0.5, 0.2, 5, 5, 2);
      this.drawShot(this.legendCx, this.legend, 0.5, 0.325, 4, 5, 2);
      this.drawShot(this.legendCx, this.legend, 0.5, 0.45, 3, 5, 2);
      this.drawShot(this.legendCx, this.legend, 0.5, 0.565, 2, 5, 2);
      this.drawShot(this.legendCx, this.legend, 0.5, 0.69, 1, 5, 2);
    }

    this.drawShot(this.legendCx, this.legend, 0.8, 0.2, 5, 5, 0);
    this.drawShot(this.legendCx, this.legend, 0.8, 0.325, 4, 4, 0);
    this.drawShot(this.legendCx, this.legend, 0.8, 0.45, 3, 3, 0);
    this.drawShot(this.legendCx, this.legend, 0.8, 0.565, 2, 2, 0);
    this.drawShot(this.legendCx, this.legend, 0.8, 0.69, 1, 1, 0);

    this.legendCx.fillStyle = 'black';
  }

  drawGameField() {
    this.fieldCx.lineWidth = 2;
    this.fieldCx.lineCap = 'round';
    this.fieldCx.strokeStyle = '#000';

    this.fieldCx.beginPath();

    this.fieldCx.moveTo(30, 0);
    this.fieldCx.lineTo(620, 0);
    this.fieldCx.lineTo(650,  75);
    this.fieldCx.lineTo(620, 100);
    this.fieldCx.lineTo(650, 125);
    this.fieldCx.lineTo(650, 205);
    this.fieldCx.lineTo(620, 230);
    this.fieldCx.lineTo(650, 255);
    this.fieldCx.lineTo(620, 330);
    this.fieldCx.lineTo(30, 330);
    this.fieldCx.lineTo(0, 255);
    this.fieldCx.lineTo(30, 230);
    this.fieldCx.lineTo(0, 205);
    this.fieldCx.lineTo(0, 125);
    this.fieldCx.lineTo(30, 100);
    this.fieldCx.lineTo(0, 75);
    this.fieldCx.lineTo(30, 0);

    this.fieldCx.moveTo(130, 0);
    this.fieldCx.lineTo(130, 330);

    this.fieldCx.moveTo(520, 0);
    this.fieldCx.lineTo(520, 330);

    this.fieldCx.moveTo(220, 0);
    this.fieldCx.lineTo(220, 55);
    this.fieldCx.lineTo(430, 55);
    this.fieldCx.lineTo(430, 0);

    this.fieldCx.moveTo(220, 330);
    this.fieldCx.lineTo(220, 275);
    this.fieldCx.lineTo(430, 275);
    this.fieldCx.lineTo(430, 330);

    this.fieldCx.moveTo(370, 55);
    this.fieldCx.lineTo(220, 125);
    this.fieldCx.lineTo(280, 275);
    this.fieldCx.lineTo(430, 205);
    this.fieldCx.lineTo(370, 55);
    this.fieldCx.stroke();



  }

  drawShot(cx: CanvasRenderingContext2D, canvas: ElementRef, relativeX: number, relativeY: number,
           scored: number, shot: number, robotSeq: number) {
    const width = canvas.nativeElement.width;
    const height = canvas.nativeElement.height;
    const x = relativeX * width;
    const y = relativeY * height;
    const scorePct = scored / shot;

    cx.beginPath();
    cx.arc(x, y, 2 * shot, 0, 2 * Math.PI, false);
    if ((this.team2Display !== 6 && robotSeq === 0) || (this.team2Display === 6 && robotSeq > 2)) {
      if (scorePct > 0.8 && scorePct <= 1.0) { cx.fillStyle = '#f00000'; }
      if (scorePct > 0.6 && scorePct <= 0.8) { cx.fillStyle = '#c00000'; }
      if (scorePct > 0.4 && scorePct <= 0.6) { cx.fillStyle = '#a00000'; }
      if (scorePct > 0.2 && scorePct <= 0.4) { cx.fillStyle = '#800000'; }
      if (scorePct > 0 && scorePct <= 0.2) { cx.fillStyle = '#600000'; }
    }
    if (this.team2Display === 3 && robotSeq === 1) {
      if (scorePct > 0.8 && scorePct <= 1.0) { cx.fillStyle = '#00f000'; }
      if (scorePct > 0.6 && scorePct <= 0.8) { cx.fillStyle = '#00c000'; }
      if (scorePct > 0.4 && scorePct <= 0.6) { cx.fillStyle = '#00a000'; }
      if (scorePct > 0.2 && scorePct <= 0.4) { cx.fillStyle = '#008000'; }
      if (scorePct > 0 && scorePct <= 0.2) { cx.fillStyle = '#006000'; }
    }
    if ((this.team2Display === 3 && robotSeq === 2) || (this.team2Display === 6 && robotSeq < 3)) {
      if (scorePct > 0.8 && scorePct <= 1.0) { cx.fillStyle = '#0000f0'; }
      if (scorePct > 0.6 && scorePct <= 0.8) { cx.fillStyle = '#0000c0'; }
      if (scorePct > 0.4 && scorePct <= 0.6) { cx.fillStyle = '#0000a0'; }
      if (scorePct > 0.2 && scorePct <= 0.4) { cx.fillStyle = '#000080'; }
      if (scorePct > 0 && scorePct <= 0.2) { cx.fillStyle = '#000060'; }
    }
    cx.fill();
    cx.lineWidth = 1;
    cx.strokeStyle = '#003300';
    cx.stroke();
  }
}
