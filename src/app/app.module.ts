import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule, MatSelectModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { PitScoutingPageComponent } from './pit-scouting-page/pit-scouting-page.component';
import {FlexModule} from '@angular/flex-layout';
import { TestComponent } from './test/test.component';
import {GoogleChartsModule} from 'angular-google-charts';
import {LoginComponent} from './login/login.component';
import {AuthService} from './auth.service';
import {AuthGuard} from './auth.guard';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/auth';
import { RootComponent } from './root/root.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    canActivate: [AuthGuard],
    // resolve: {
    //   notes: AppComponent
    // }
  },
  {path: 'login', component: LoginComponent},

];

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    PitScoutingPageComponent,
    TestComponent,
    LoginComponent,
    RootComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    GoogleChartsModule.forRoot(),
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
    MatToolbarModule,
    RouterModule.forRoot(routes),
    FlexModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      // tslint:disable-next-line:only-arrow-functions
      useFactory: (as: AuthService) => function() {
        return as.load();
      },
      deps: [AuthService],
      multi: true
    },
  ],  bootstrap: [AppComponent]
})
export class AppModule { }
