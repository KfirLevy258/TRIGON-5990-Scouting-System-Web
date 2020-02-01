import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GoogleChartComponent} from 'angular-google-charts';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, AfterViewInit {
  myData = [
    ['London', 8136000],
    ['New York', 8538000],
    ['Paris', 2244000],
    ['Berlin', 3470000],
    ['Kairo', 19500000],
  ];

  @ViewChild('chart', {static: true})
  chart: GoogleChartComponent;

  ngOnInit() {
    const wrapper = this.chart.wrapper;

    // wrapper.draw(myAdvancedData);
  }

  ngAfterViewInit(): void {

  }

  test() {
    console.log(this.chart.wrapper.setOption('title', 'aaa'));
  }
}
