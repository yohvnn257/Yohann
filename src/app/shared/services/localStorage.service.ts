import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    /**
     * Enregistre une valeur dans le local storage
     *
     * @param nom le clé de la valeur
     * @param valeur la valeur enregistrer
     */
    enregistrerValeur(nom: string, valeur: string): void {
        localStorage.setItem(nom, valeur);
    }

    /**
     * Recupere la valeur rechercher
     *
     * @param nom le clé de la valeur rechercher
     * @returns la valeur rechercher
     */
    recupererValeur(nom: string): string {
        return localStorage.getItem(nom);
    }

    /**
     * Permet de savoir si nous avons une periode selectionnée
     *
     * @returns true si la periode est renseignée, false sinon
     */
    estPeriode(): boolean {
        return this.recupererValeur('dateDebut') !== null && this.recupererValeur('dateFin') !== null;
    }

    /**
     * Permet de savoir si nous avons un mois selectionné
     *
     * @returns true si le mois est renseigné, false sinon
     */
    estMois(): boolean {
        return this.recupererValeur('mois') !== null;
    }

    /**
     * Permet de savoir si nous avons une annee selectionnée
     *
     * @returns true si l'annee est renseignée, false sinon
     */
    estAnnee(): boolean {
        return this.recupererValeur('annee') !== null;
    }
}
