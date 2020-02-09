import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  res: number;
  angleDeg: number;

  @ViewChild('canvas', {static: true}) canvas: ElementRef;
  private cx: CanvasRenderingContext2D;

  constructor(private fb: FormBuilder) {
  }
  testForm: FormGroup;

  ngOnInit() {
    this.testForm = this.fb.group({
      m1: ['60'],
      d1: ['0'],
      m2: ['70'],
      d2: [''],
      m3: ['80'],
      d3: ['0'],
    });

    this.cx = this.canvas.nativeElement.getContext('2d');
  }

  calc() {
    const PIVOT_TO_RUNG = 48 * 2.54 * 0.01; // [m]
    const MASS = 93 * 0.453592; // [Kg]
    const CENTER_OF_MASS_OFFSET = 26 * 2.54 * 0.01; // [m]
    let  m1: number; let d1: number;
    let  m2: number; let d2: number;
    let  m3: number; let d3: number;

    m1 = Number(this.testForm.value.m1);
    d1 = Number(this.testForm.value.d1);
    m2 = Number(this.testForm.value.m2);
    d2 = Number(this.testForm.value.d2);
    m3 = Number(this.testForm.value.m3);
    d3 = Number(this.testForm.value.d3);

    this.res = Math.atan((m1 * d1 + m2 * d2 + m3 * d3) / ((m1 + m2 + m3) * PIVOT_TO_RUNG  + MASS * CENTER_OF_MASS_OFFSET)) ;
    this.draw(this.res, d1, d2, d3);
    this.angleDeg = this.res / Math.PI * 180;
  }

  draw(angle: number, d1: number, d2: number, d3: number) {
    console.log(this.canvas.nativeElement.width);
    if (d2 === d1) {d2 = d1 + 0.1; }
    if (d3 === d1) {d3 = d1 + 0.1; }
    if (d3 === d2) {d3 = d2 + 0.1; }

    this.cx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    // this.cx.rotate(angle);
    this.cx.beginPath();
    this.cx.moveTo(200 - 100 * Math.cos(angle), 200 - 100 * Math.sin(angle));
    this.cx.lineTo(200 + 100 * Math.cos(angle), 200 + 100 * Math.sin(angle));

    this.cx.stroke();

    this.cx.beginPath();
    this.cx.arc(200 + d1 / 1.4 * 100 * Math.cos(angle), 200 + d1 / 1.4 * 100 * Math.sin(angle),
      10, 0, 2 * Math.PI, false);
    this.cx.fillStyle = 'green';
    this.cx.fill();
    this.cx.lineWidth = 1;
    this.cx.strokeStyle = '#003300';
    this.cx.stroke();

    this.cx.beginPath();
    this.cx.arc(200 + d2 / 1.4 * 100 * Math.cos(angle), 200 + d2 / 1.4 * 100 * Math.sin(angle),
      10, 0, 2 * Math.PI, false);
    this.cx.fillStyle = 'red';
    this.cx.fill();
    this.cx.lineWidth = 1;
    this.cx.strokeStyle = '#003300';
    this.cx.stroke();

    this.cx.beginPath();
    this.cx.arc(200 + d3 / 1.4 * 100 * Math.cos(angle), 200 + d3 / 1.4 * 100 * Math.sin(angle),
      10, 0, 2 * Math.PI, false);
    this.cx.fillStyle = 'blue';
    this.cx.fill();
    this.cx.lineWidth = 1;
    this.cx.strokeStyle = '#003300';
    this.cx.stroke();
  }

  clear() {
    console.log('clear');
    this.cx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

  }

  suggest() {
    let  m1: number; let d1: number;
    let  m2: number; let d2: number;

    m1 = Number(this.testForm.value.m1);
    m2 = Number(this.testForm.value.m2);

    if (m1 / m2 < 2.5) {
      d1 = -0.4 * 1.4;
      d2 = 0.4 * 1.4 * m1 / m2;
    } else {
      d2 = 1.4;
      d1 = - m2 / m1 * 1.4;
    }
    this.testForm.controls.d3.setValue('0');
    this.testForm.controls.d1.setValue(d1);
    this.testForm.controls.d2.setValue(d2);

    this.calc();
  }
}
