import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {defaultDialogConfig} from '../default-dialog-config';
import {EditUserDialogComponent} from '../edit-user-dialog/edit-user-dialog.component';

export class User {
  uid: string;
  name: string;
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
  displayedColumns: string[] = ['photo', 'name', 'email', 'teamMember', 'teamLeader', 'admin', 'Actions'];

  constructor(private db: AngularFirestore,
              private dialog: MatDialog) { }

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

  teamMemberChange(user) {
    const updatedUser = {
      ...user
    } as User;
    updatedUser.teamMember = !updatedUser.teamMember;
    this.updateUser(updatedUser);
  }

  teamLeaderChange(user) {
    const updatedUser = {
      ...user
    } as User;
    updatedUser.teamLeader = !updatedUser.teamLeader;
    this.updateUser(updatedUser);
  }

  adminChange(user) {
    const updatedUser = {
      ...user
    } as User;
    updatedUser.admin = !updatedUser.admin;
    this.updateUser(updatedUser);
  }
  updateUser(updatedUser: User) {
    this.db.collection('users').doc(updatedUser.uid).update(updatedUser)
      .catch(err => console.log(err));
  }

  editUser(currentUser: User) {

    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: 'Edit User',
      user: currentUser,
      mode: 'update'
    };

    console.log(currentUser);

    this.dialog.open(EditUserDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(res => {
        if (res) {
          const photoFile = res.photoFile;
          const editedUser = res.user;
          const password = String(editedUser.password);
          delete editedUser.password;

          this.updateUser(editedUser);

        }
      });
  }

}
