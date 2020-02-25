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
    // this.db.collection('tournaments').doc('ISRD1').collection('teams').doc('temp').collection('games').get()
    //   .pipe(take(1))
    //   .subscribe(res => {
    //     console.log(res.docs);
    //     res.docs.forEach(doc => {
    //       console.log(doc.id);
    //       this.db.collection('tournaments').doc('ISRD1').collection('teams').doc('1577').collection('games').doc(doc.id).set(doc.data())
    //         .catch(err => console.log(err));
    //
    //     });
    //   });
  }

  start() {
    // const source = this.sourceRef.nativeElement.value;
    const source = 'ISRD1';
    // const dest = this.destRef.nativeElement.value;
    const dest = 'temp';

    this.db.collection('tournaments').doc(source).collection('teams').get()
      .pipe(take(1))
      .subscribe(sourceTeams => {
        sourceTeams.docs.forEach(team => {
          this.db.collection('tournaments').doc(dest).collection('teams').doc(team.id).set(team.data())
            .catch(err => console.log(err));
        });
      });
  }
}
