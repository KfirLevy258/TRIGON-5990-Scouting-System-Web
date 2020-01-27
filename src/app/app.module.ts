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
import { FullTeamDataComponent } from './full-team-data/full-team-data.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { PitScoutingPageComponent } from './pit-scouting-page/pit-scouting-page.component';
import {FlexModule} from '@angular/flex-layout';
import {GoogleChartsModule} from 'angular-google-charts';
import {LoginComponent} from './login/login.component';
import {AuthService} from './auth.service';
import {AuthGuard} from './auth.guard';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/auth';
import { HomeComponent } from './home/home.component';
import { PreGameComponent } from './pre-game/pre-game.component';
import { AllianceSelectionComponent } from './alliance-selection/alliance-selection.component';
import { UsersManagementComponent } from './users-management/users-management.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pre-game',
    component: PreGameComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'alliance-selection',
    component: AllianceSelectionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'full_team_data',
    component: FullTeamDataComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users-management',
    component: UsersManagementComponent,
    canActivate: [AuthGuard],
  },
  {path: 'login', component: LoginComponent},

];

@NgModule({
  declarations: [
    AppComponent,
    FullTeamDataComponent,
    PitScoutingPageComponent,
    LoginComponent,
    HomeComponent,
    PreGameComponent,
    AllianceSelectionComponent,
    UsersManagementComponent,

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
