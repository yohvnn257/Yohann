import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { AuthDTO } from '../models/auth.dto';
import { TokenDTO } from '../models/tokens';
import { HUB_URL, UrlServeur } from '../constants/url-serveur';
import { Utilisateur } from '../models/utilisateur';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private jwtHelper = new JwtHelperService();

    constructor(
        private http: HttpClient,
        private router: Router,
        private titlecase: TitleCasePipe
    ) {}

    /**
     * Authentifie un utilisateur.
     *
     */
    public connexion(authDto: AuthDTO): Observable<TokenDTO> {
        return this.http.post<TokenDTO>(UrlServeur.connexion, authDto, {
            headers: new HttpHeaders({ timeout: `${50000}` })
        });
    }

    /**
     * Enregistre le token dans le localStorage.
     *
     * @public
     * @param jwtToken
     */
    public enregistrerToken(jwtToken: string): void {
        localStorage.setItem('token', jwtToken);
    }

    /**
     * Enregistre le role dans le localStorage.
     *
     * @public
     * @param role
     */
    public enregistrerRole(role: string): void {
        localStorage.setItem('role', role);
    }

    /**
     * Récupère le role dans le localStorage.
     *
     * @return any
     * @public
     */
    public recupererRoleApplication(): any {
        const role = localStorage.getItem('role');
        return role || '';
    }

    /**
     * Récupère le token dans le localStorage.
     *
     * @return any
     * @public
     */
    public recupererToken(): any {
        const token = localStorage.getItem('token');
        return token || '';
    }

    /**
     * Retourne l'utilisateur connecté.
     *
     * @return utilisateur
     * @public
     */
    public recupererUtilisateurConnecte(): Utilisateur {
        if (this.isAuthenticated()) {
            const utilisateur = new Utilisateur();
            const token = this.jwtHelper.decodeToken(this.recupererToken());
            utilisateur.id = token.id;
            utilisateur.nom = token.nom;
            utilisateur.prenoms = token.prenoms;
            utilisateur.username = token.username;
            utilisateur.role = token.role;
            utilisateur.premiereConnection = token.premiereConnection;
            utilisateur.isCollaborateur = token.isCollaborateur;
            return utilisateur;
        }
        return null;
    }

    /**
     * Retourne l'etat du token (toujours valide ou invalide).
     *
     * @public
     */
    public isAuthenticated(): boolean {
        const token = this.recupererToken();
        if (token) {
            return !this.jwtHelper.isTokenExpired(token);
        }
        return false;
    }

    /**
     * Retourne le nom et prénom de l'utilisateur connecté.
     */
    public recupererNomEtPrenom(): string | null {
        const utilisateur = this.recupererUtilisateurConnecte();
        if (utilisateur) {
            return utilisateur.nom.toUpperCase().concat(' ').concat(this.titlecase.transform(utilisateur.prenoms));
        }
        return null;
    }

    /**
     * Recupere le role de l'utilisateur
     *
     * @returns le role de l'utilisateur
     */
    recupererRole(): string {
        const utilisateur = this.recupererUtilisateurConnecte();
        return utilisateur.role;
    }

    /**
     * Permet de savoir l'utilisateur est Responsable RH
     */
    isGestionnaire(): boolean {
        return this.recupererRoleApplication() === 'GESTIONNAIRE';
    }

    /**
     * Permet de savoir l'utilisateur est Collaborateur
     */
    isUser(): boolean {
        return this.recupererRoleApplication() === 'USER';
    }

    /**
     * Permet de savoir l'utilisateur est Admin
     */
    isAdmin(): boolean {
        return this.recupererRoleApplication() === 'ADMIN';
    }

    /**
     * Recupere le role de l'utilisateur
     *
     * @returns le role de l'utilisateur
     */
    recupererId(): number {
        const utilisateur = this.recupererUtilisateurConnecte();
        return utilisateur.id;
    }

    /**
     * Permet de savoir si c'est la première fois que l'utilisateur est connecté
     *
     * @returns le role de l'utilisateur
     */
    isPremiereConnection(): boolean {
        const utilisateur = this.recupererUtilisateurConnecte();
        return utilisateur.premiereConnection;
    }

    /**
     * Deconnecte l'utilisateur
     */
    deconnecter() {
        this.logout().then(() => {
            window.location.href = HUB_URL;
        });
    }

    /**
     * Effectue la déconnexion d'un utilisateur.
     */
    logout(): Promise<void> {
        return new Promise((resolve) => {
            localStorage.clear();
            resolve();
        });
    }
}
