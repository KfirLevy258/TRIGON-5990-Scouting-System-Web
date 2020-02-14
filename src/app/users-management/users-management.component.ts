import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {defaultDialogConfig} from '../default-dialog-config';
import {AngularFireFunctions} from '@angular/fire/functions';
import {AngularFireStorage} from '@angular/fire/storage';
import {DialogVerifyComponent} from '../dialog-verify/dialog-verify.component';
import {UserEditDialogComponent} from '../user-edit-dialog/user-edit-dialog.component';

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
  isLoading: boolean;

  constructor(private db: AngularFirestore,
              private aff: AngularFireFunctions,
              private storage: AngularFireStorage,
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
   // this.users$.subscribe(res => console.log(res));
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

    this.dialog.open(UserEditDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(res => {
        if (res) {
          const photoFile = res.photoFile;
          const editedUser = res.user;
          const password = String(editedUser.password);
          delete editedUser.password;

          this.updateUser(editedUser);
          if (photoFile) {
            this.updatePhoto(editedUser.uid, photoFile)
              .catch(err => console.log(err));
          }
          if (currentUser.email !== editedUser.email) {
            this.aff.functions.httpsCallable('updateEmail')({
              uid: editedUser.uid,
              email: editedUser.email
            });
          }
          if (password) {
            this.aff.functions.httpsCallable('resetPassword')({
              uid: editedUser.uid,
              password
            });
          }
        }
      });
  }

  deleteUser(user: User) {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: 'User Delete',
      message: 'Delete user ' + user.name + ' ?'
    };

    // ToDO - button focus after return from dialog
    this.dialog.open(DialogVerifyComponent, dialogConfig)
      .afterClosed()
      .pipe(
        take(1)
      )
      .subscribe(okToDelete => {
        if (okToDelete) {
          this.db.collection('users').doc(user.uid).delete()
            .then(() => {
              this.aff.functions.httpsCallable('deleteUser')({
                uid: user.uid
              });
            });
        }
      });
  }

  addUser() {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: 'Add User',
      mode: 'create'
    };

    this.dialog.open(UserEditDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.isLoading = true;
          const photoFile = res.photoFile;
          const newUser = res.user;
          this.createUser(newUser, photoFile)
            .then(() => {
              this.isLoading = false;
            });
        }
      });
  }

  async createUser(newUser, photoFile: File) {
    const addResult = await this.aff.functions.httpsCallable('createUser')({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      phoneNumber: newUser.phoneNumber,
    });
    const userRecord = addResult.data;
    const uid = userRecord.uid;

    if (photoFile) {
      await this.updatePhoto(uid, photoFile);
    }
    return uid;
  }

  async updatePhoto(uid: string, file: File) {
    const path = `users/${uid}`;

    const result = await this.storage.upload(path, file);
    const url = await result.ref.getDownloadURL();

    await this.db.collection('users').doc(uid).update({
      photoURL: url
    });

    return url;
  }
}
