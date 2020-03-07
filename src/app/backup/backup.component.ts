import {Component, OnInit, ViewChild} from '@angular/core';
import {take} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss']
})
export class BackupComponent implements OnInit {

  @ViewChild('tournament', {static: false}) tournamentRef;

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
  }

  start()  {
    const tournament = this.tournamentRef.nativeElement.value;

    this.db.collection('tournaments').doc(tournament).collection('teams').get()
      .pipe(take(1))
      .subscribe(sourceTeams => {
        sourceTeams.docs.forEach(team => {
          this.db.collection('tournaments').doc(tournament).collection('teams').doc(team.id).collection('games').get()
            .pipe(take(1))
            .subscribe(games => {
              this.db.collection('backup').doc(tournament).collection('teams').doc(team.id).set(team.data())
                .catch(err => console.log(err));
              games.docs.forEach(game => {
                this.db.collection('backup').doc(tournament).collection('teams').doc(team.id).
                collection('games').doc(game.id).set(game.data())
                  .catch(err => console.log(err));
              });
            });



        });
        console.log('backup ended');
      });
  }

  delete() {
    const tournament = this.tournamentRef.nativeElement.value;

    this.db.collection('backup').doc(tournament).collection('teams').get()
      .pipe(take(1))
      .subscribe(teams => {
        teams.docs.forEach(team  => {
          this.db.collection('backup').doc(tournament).collection('teams').doc(team.id).collection('games').get()
            .pipe(take(1))
            .subscribe(games => {
              games.docs.forEach(game => {
                this.db.collection('backup').doc(tournament).collection('teams').doc(team.id).collection('games').doc(game.id).delete()
                  .catch(err => console.log(err));
              });
              this.db.collection('backup').doc(tournament).collection('teams').doc(team.id).delete()
                .catch(err => console.log(err));
            });
        });
      });

  }

}
