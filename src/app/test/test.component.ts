import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {take} from 'rxjs/operators';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(private db: AngularFirestore) {
  }

  ngOnInit() {
    this.db.collection('tournaments').doc('ISRD1').collection('teams').doc('temp').collection('games').get()
      .pipe(take(1))
      .subscribe(res => {
        console.log(res.docs);
        res.docs.forEach(doc => {
          console.log(doc.id);
          this.db.collection('tournaments').doc('ISRD1').collection('teams').doc('1577').collection('games').doc(doc.id).set(doc.data())
            .catch(err => console.log(err));

        });
      });
  }

}
