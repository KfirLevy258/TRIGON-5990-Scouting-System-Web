import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

export class User {
  uid: string;
  displayName: string;
  email: string;
  teamMember: boolean;
  teamLeader: boolean;
  admin: boolean;
  photoURL: string;
}

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent implements OnInit {

  users$: Observable<User[]>;
  displayedColumns: string[] = ['photo', 'displayName', 'email', 'teamMember', 'teamLeader', 'Admin', 'Actions'];

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
   this.users$ = this.db.collection('users').snapshotChanges()
     .pipe(map(arr => {
       return  arr.map(snap => {
         const data = snap.payload.doc.data();
         const uid = snap.payload.doc.id;
         return {uid, ... data} as User;
       });
     }));

   this.users$.subscribe(res => console.log(res));
  }

}
