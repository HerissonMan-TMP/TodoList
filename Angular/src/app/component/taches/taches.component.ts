import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Tache } from 'src/app/model/tache';
import { TachesService } from 'src/app/service/taches.service';

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

  constructor(private tacheService: TachesService) { }

  listes = [
    'absenceDeValeur',
    'enAttente',
    'enCours',
    'termine',
    'acquis'
  ];

  taches: tachesInterface = {};

  newTache: newTachesInterface = {};

  ngOnInit(): void {
    for (let statut of this.listes) {
      this.taches[statut] = [];

      this.newTache[statut] = {
        titre : '',
        termine : false,
        statut
      }
    }

    this.tacheService.getTaches().subscribe({
      next: (data:Array<Tache>) => {
        for (let tache of data) {
          this.taches[tache.statut].push(tache)
        }
      }
    });
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

  drop(event: CdkDragDrop<string[]>, statut: string) {
    if (event.previousContainer != event.container) {
      let statutPrecedent = event.item.data.statut;

      let tacheADeplacer = event.item.data;
      tacheADeplacer.statut = statut;

      this.tacheService.updateTaches(tacheADeplacer).subscribe({
        next:(data) =>{
          this.taches[statutPrecedent] = this.taches[statutPrecedent].filter(tache => tache._id != tacheADeplacer._id);

          this.taches[statut].push(tacheADeplacer);
        }
      });
    }
  }
}
