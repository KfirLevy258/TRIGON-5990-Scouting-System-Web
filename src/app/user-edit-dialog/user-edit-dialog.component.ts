import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {User} from '../users-management/users-management.component';

const myFormValidator: ValidatorFn = (fg: FormGroup) => {
  const mode = fg.value.mode;
  const email = fg.value.email;
  const password = fg.value.password;
  const phoneNumber = fg.value.phoneNumber;
  const currentUser = fg.value.currentUser;

  if (mode === 'create') {
    if (email && !password) {
      return { password: true};
    }
    if (password && !email) {
      return { password: true};
    }
    if (!email && ! phoneNumber) {
      return  {noAuth: true};
    }
  } else { // mode = 'update
    if (currentUser.phoneNumber && !phoneNumber) {
      return {phoneNumber: true};
    }
    if (currentUser.email && !email) {
      return {email: true};
    }

  }
  return null;
};

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss']
})
export class UserEditDialogComponent {

  form: FormGroup;
  photoFileURL;
  photoFile;
  dialogTitle: string;
  user: User;
  mode: 'create' | 'update';

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<UserEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {

    this.dialogTitle = data.dialogTitle;
    this.user = data.user;
    this.mode = data.mode;

    const formControls = {
      name: ['', Validators.required],
      teamMember: [''],
      teamLeader: [''],
      admin: [''],
      activeScouter: [''],
      email: ['', Validators.email],
      password: ['', Validators.minLength(6)],
      // controls used to pass data to validator
      mode: [this.mode],
      currentUser: [this.user]
    };

    this.form = this.fb.group(formControls, {validators: myFormValidator});
    if (this.mode === 'update') {
      this.form.patchValue({...data.user});
    }
  }


  cancel() {
    this.dialogRef.close(null);
  }

  save() {

    const formFields = this.form.value;
    delete formFields.currentUser;
    delete formFields.mode;

    const user: User = {
      ...this.user,
      ...formFields,
    };


    const result = {
      user,
      photoFile: this.photoFile
    };

    this.dialogRef.close(result);
  }

  async loadPhotoFile(event) {
    const reader = new FileReader();
    this.photoFile = event.target.files[0];
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (ev: any) => {
      this.photoFileURL = ev.target.result;
    };
  }

}
