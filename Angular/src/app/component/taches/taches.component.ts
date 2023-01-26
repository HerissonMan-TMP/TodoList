import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Tache } from 'src/app/model/tache';
import { Liste } from 'src/app/model/liste';
import { TachesService } from 'src/app/service/taches.service';
import { ListesService } from 'src/app/service/listes.service';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';

interface newTachesInterface {
  [key: string]: Tache
}

interface tachesInterface {
  [key: string]: Array<Tache>
}

@Component({
  selector: 'app-taches',
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.css']
})
export class TachesComponent implements OnInit {

  constructor(private tacheService: TachesService, private listeService: ListesService, private userService: UserService, private router: Router) { }

  listes: Array<Liste> = [];

  userId: string = '';

  taches: tachesInterface = {};

  newTache: newTachesInterface = {};

  newListe: Liste = {
    titre: '',
    userId: '',
  };

  ngOnInit(): void {
    this.userService.isConnected().subscribe({
      next: (data: any) => {
        if (data.user == null) {
          this.router.navigate([''])
        } else {
          this.userId = data.user._id;
        }
      }
    })

    this.listeService.getListes(this.userId).subscribe({
      next: (data:Array<Liste>) => {
        for (let liste of data) {
          this.listes.push(liste)

          this.taches[liste.titre] = [];
    
          this.newTache[liste.titre] = {
            titre : '',
            termine : false,
            statut: liste.titre,
            userId: this.userId,
          }
        }
      }
    });

    this.tacheService.getTaches().subscribe({
      next: (data:Array<Tache>) => {
        for (let tache of data) {
          this.taches[tache.statut].push(tache)
        }
      }
    });
  }

  ajouterListe() {
    this.newListe.userId = this.userId;
    this.listeService.ajoutListes(this.newListe).subscribe({
      next:(data) =>{
        this.listes.push(data)

        this.taches[data.titre] = [];
    
          this.newTache[data.titre] = {
            titre : '',
            termine : false,
            statut: data.titre,
            userId: this.userId,
          }
      }
    });
  }

  supprimerListe(liste: Liste) {
    this.listeService.removeListes(liste).subscribe({
      next:(data) =>{
        delete this.newTache[liste.titre];

        for (let tache of this.taches[liste.titre]) {
          this.supprimer(tache);
        }

        delete this.taches[liste.titre];

        this.listes = this.listes.filter(item => item._id != liste._id);
      }
    })
  }

  ajouter(statut: string) {
    this.tacheService.ajoutTaches(this.newTache[statut]).subscribe({
      next:(data) =>{
        this.taches[data.statut].push(data)
      }
    });
  }

  supprimer(tacheASupprimer: Tache) {
    this.tacheService.removeTaches(tacheASupprimer).subscribe({
      next:(data) =>{
        this.taches[tacheASupprimer.statut] = this.taches[tacheASupprimer.statut].filter(tache => tache._id != tacheASupprimer._id)
      }
    });
  }

  modifier(tacheAModifier: Tache) {
    tacheAModifier.termine = !tacheAModifier.termine

    this.tacheService.updateTaches(tacheAModifier).subscribe({
      next:(data) =>{
        this.taches[tacheAModifier.statut] = this.taches[tacheAModifier.statut].map(tache => {
          if (tache._id == tacheAModifier._id) {
            return tacheAModifier
          } else {
            return tache
          }
        })
      }
    });
  }

  drop(event: CdkDragDrop<string[]>, liste: Liste) {
    if (event.previousContainer != event.container) {
      let statutPrecedent = event.item.data.statut;

      let tacheADeplacer = event.item.data;
      tacheADeplacer.statut = liste.titre;

      this.tacheService.updateTaches(tacheADeplacer).subscribe({
        next:(data) =>{
          this.taches[statutPrecedent] = this.taches[statutPrecedent].filter(tache => tache._id != tacheADeplacer._id);

          this.taches[liste.titre].push(tacheADeplacer);
        }
      });
    }
  }

  logout() {
    this.userService.logout().subscribe({
      next: (data) => {
        this.router.navigate(['']);
      }
    });
  }
}
