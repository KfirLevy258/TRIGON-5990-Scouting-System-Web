import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {take} from 'rxjs/operators';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  @ViewChild('source', {static: false}) sourceRef;
  @ViewChild('dest', {static: false}) destRef;

  constructor(private db: AngularFirestore) {
  }

  ngOnInit() {

  }


}
