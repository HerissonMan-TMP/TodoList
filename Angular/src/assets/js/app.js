import { TacheHtml } from "./tacheHtml.js";
import { ajoutTaches } from "./api.js";

export class Application {

    listeTachesHtml;

    constructor(taches) {

        // récupère l'élément HTML d'id listeTaches
        this.listeTachesHtml = {
            absenceDeValeur: document.getElementById('listeTaches_absenceDeValeur'),
            enAttente: document.getElementById('listeTaches_enAttente'),
            enCours: document.getElementById('listeTaches_enCours'),
            termine: document.getElementById('listeTaches_termine')
        };

        // Boucle sur toutes les taches
        taches.forEach(todo => {
            //Pour chaque tache on crée une balise HTML div contenant le titre de la tache
            let tacheHtml = new TacheHtml(todo);
            // On attache ce nouvel élément HTML à la div
            this.listeTachesHtml[todo.statut].appendChild(tacheHtml.elementParentHTML);
        });

        const buttonsAdd = {
            absenceDeValeur: document.getElementById("buttonAjoutTache_absenceDeValeur"),
            enAttente: document.getElementById("buttonAjoutTache_enAttente"),
            enCours: document.getElementById("buttonAjoutTache_enCours"),
            termine: document.getElementById("buttonAjoutTache_termine")
        }

        const inputsAjoutTache = {
            absenceDeValeur: document.getElementById("inputAjoutTache_absenceDeValeur"),
            enAttente: document.getElementById("inputAjoutTache_enAttente"),
            enCours: document.getElementById("inputAjoutTache_enCours"),
            termine: document.getElementById("inputAjoutTache_termine")
        }

        for (const [key, value] of Object.entries(buttonsAdd)) {
            value.addEventListener("click", (e) => { //async (e) => {
                let inputAjoutTache = inputsAjoutTache[key];
                let maTache = { "titre": inputAjoutTache.value, "termine": false, "statut": key };
                ajoutTaches(maTache).then((rep) => {
                    maTache._id = rep._id;
                    let tacheHtml = new TacheHtml(maTache);
                    this.listeTachesHtml[key].appendChild(tacheHtml.elementParentHTML);
                });
                // let rep = await ajoutTaches(maTache);
                // maTache._id = rep.id;
                // this.listeTachesHtml.appendChild(tacheHtml.elementParentHTML);     
            });
        }
    }
}