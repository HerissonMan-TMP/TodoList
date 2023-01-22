import { Component, OnInit } from '@angular/core';
import { Tache } from 'src/app/model/tache';
import { TachesService } from 'src/app/service/taches.service';

interface newTachesInterface {
  [key: string]: Tache
}

@Component({
  selector: 'app-taches',
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.css']
})
export class TachesComponent implements OnInit {

  constructor(private tacheService: TachesService) { }

  taches: Array<Tache> = [];

  newTache: newTachesInterface = {
    'absenceDeValeur': {
      titre : '',
      termine : false,
      statut: 'absenceDeValeur'
    },
    'enAttente': {
      titre : '',
      termine : false,
      statut: 'enAttente'
    },
    'enCours': {
      titre : '',
      termine : false,
      statut: 'enCours'
    },
    'termine': {
      titre : '',
      termine : false,
      statut: 'termine'
    }
  }

  ngOnInit(): void {
    this.tacheService.getTaches().subscribe({
      next: (data:Array<Tache>) => {
        this.taches = data;
      }
    });
  }

  ajouter(statut: string) {
    this.tacheService.ajoutTaches(this.newTache[statut]).subscribe({
      next:(data) =>{
        this.taches.push(data)
      }
    });
  }

  supprimer(tacheASupprimer: Tache) {
    this.tacheService.removeTaches(tacheASupprimer).subscribe({
      next:(data) =>{
        this.taches = this.taches.filter(tache => tache._id != tacheASupprimer._id)
      }
    });
  }

  modifier(tacheAModifier: Tache) {
    tacheAModifier.termine = !tacheAModifier.termine

    this.tacheService.updateTaches(tacheAModifier).subscribe({
      next:(data) =>{
        this.taches.map(tache => {
          if (tache._id == data._id) {
            tache = data
          }
        })
      }
    });
  }
}
