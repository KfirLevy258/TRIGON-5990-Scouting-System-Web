import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  test: Array<Array<any>> = [];
  myData = [
    ['London', 8136000],
    ['New York', 8538000],
    ['Paris', 2244000],
    ['Berlin', 3470000],
    ['Kairo', 19500000],
  ];

  constructor() { }

  ngOnInit() {
    this.test.push(['a', 5], ['b', 5]);
    console.log(this.test);
    console.log(this.myData);
  }

}
