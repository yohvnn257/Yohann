import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {
    apiUrl = environment.apiUrl;
    url = environment.url;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            url: this.preparerUrl(req.url),
            withCredentials: true,
            setHeaders: {
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': this.url,
                'Access-Control-Expose-Headers': 'Authorization'
            }
        });
        return next.handle(req);
    }

    /**
     * Prépare l'url à exécuter en remplaçant éventuellement le domaine.
     *
     * @param url l'url à exécuter.
     * @private
     */
    private preparerUrl(url: string): string {
        if (url.includes('assets')) {
            return url;
        }

        url = this.isAbsoluteUrl(url) ? url : this.apiUrl + '/' + url;
        return url.replace(/([^:]\/)\/+/g, '$1');
    }

    /**
     * Retourne true s'il s'agit d'une url complète c'est-à-dire qu'elle contient http.
     *
     * @param url l'url à tester.
     * @private
     */
    private isAbsoluteUrl(url: string): boolean {
        const absolutePattern = /^http?:\/\//i;
        return absolutePattern.test(url);
    }
}
