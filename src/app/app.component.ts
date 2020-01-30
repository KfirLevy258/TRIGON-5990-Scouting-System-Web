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
  userName;
  tournaments: Observable<any[]>;
  selectedTournament: string;

  constructor(private authService: AuthService,
              private router: Router,
              private db: AngularFirestore) {
    this.authService.authUser$
      .subscribe(authUser => {
        this.authUser = authUser;
        this.loadTournaments();
      });
  }

  ngOnInit() {
    this.selectedTournament = localStorage.getItem('tournament');
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
    this.router.navigateByUrl('');
  }

  logout() {
    this.authService.signOut()
      .then(() => {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigateByUrl('login');
      })
      .catch(err => console.log(err));
  }
}
