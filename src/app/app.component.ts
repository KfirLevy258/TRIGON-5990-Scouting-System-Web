import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  authUser;
  user;
  isAdmin = false;
  userName;
  tournaments: Observable<any[]>;
  selectedTournament: string;
  homeTeam: string;

  constructor(private authService: AuthService,
              private router: Router,
              private db: AngularFirestore) {
    this.authService.authUser$
      .subscribe(authUser => {
        if (authUser) {
          console.log('auth user changed');
          this.authUser = authUser;
          this.db.collection('users').doc(authUser.uid).valueChanges()
            .subscribe((user: any) => {
              this.isAdmin = user.admin;
              // this.user = user;
            });
          this.loadTournaments();
        }
      });
  }

  ngOnInit() {
    this.selectedTournament = localStorage.getItem('tournament');
    this.homeTeam = localStorage.getItem('homeTeam');

    if (this.authUser) {
      this.loadTournaments();
    }
  }

  loadTournaments() {
    this.tournaments = this.db.collection('tournaments').snapshotChanges()
      .pipe(map(arr => {
        return arr.map(snap => {
          return snap.payload.doc.id;
        });
      }));
  }

  tournamentSelect(tournament) {
    this.selectedTournament = tournament;
    localStorage.setItem('tournament', tournament);
    this.db.collection('tournaments').doc(tournament).get()
      .pipe(take(1))
      .subscribe(tour => {
        localStorage.setItem('event_key', tour.data().event_key);
      });
    this.router.navigateByUrl('')
      .catch(err => console.log(err));
  }

  logout() {
    this.authService.signOut()
      .then(() => {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigateByUrl('login');
      })
      .catch(err => console.log(err));
  }

  homeTeamChange(event) {
    localStorage.setItem('homeTeam', event.target.value);
    this.router.navigateByUrl('')
      .catch(err => console.log(err));
  }
}
