import { TitleCasePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MotDePasseDTO } from '../models/mot-passe.dto';
import { UrlServeur } from '../constants/url-serveur';

@Injectable({
    providedIn: 'root'
})
export class EmployeService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private titlecase: TitleCasePipe
    ) {}

    /**
     * Changer mot de passe.
     *
     */
    public changerMotPasse(motDePasseDto: MotDePasseDTO, id: number): Observable<void> {
        return this.http.post<void>(UrlServeur.employe + '/modifier-mot-de-passe/' + id, motDePasseDto, {
            headers: new HttpHeaders({ timeout: `${50000}` })
        });
    }
}
