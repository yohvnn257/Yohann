import { Injectable } from '@angular/core';
import { HttpClient, HttpParameterCodec } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BrowserService {
    constructor(private http: HttpClient) {}

    context(): string {
        const context = window.location.pathname.split('/')[0];
        if (context.indexOf('.html') >= 0) {
            return '/';
        }
        return '/' + context;
    }

    path(): string {
        let context = this.context();
        if (context.charAt(context.length - 1) === '/') {
            context = context.substr(0, context.length - 1);
        }
        return context;
    }

    url(path: string, prefix?: string): string {
        return this.path() + path;
    }

    ouvrirPdf(url: string, callbackFn?: any, errorCallbackFn?: any, rapport?: any): void {
        // Window.open(this.url(url));
        this.http.post(this.url(url), rapport, { observe: 'response', responseType: 'arraybuffer' }).subscribe(
            (response) => {
                if (response.headers.get('content-type')) {
                    let data = '';
                    if (response.body) {
                        // @ts-ignore
                        data = window.URL.createObjectURL(new Blob([response.body], { type: response.headers.get('content-type') }));
                    }
                    const link = document.createElement('a');
                    link.href = data;
                    link.target = '_blank';

                    // Si cela n'est pas un pdf on va demander l'enregistrement du fichier
                    if (response.headers) {
                        const filenameAttribute = 'filename=';
                        // eslint-disable-next-line max-len
                        if (response.headers && response.headers.get('content-type')?.indexOf('pdf') === -1 && response.headers.get('content-disposition') && response.headers.get('content-disposition')?.indexOf(filenameAttribute) !== -1) {
                            // eslint-disable-next-line max-len
                            const download = response.headers
                                .get('content-disposition')
                                ?.substring(response.headers.get('content-disposition')!.indexOf(filenameAttribute) + filenameAttribute.length)
                                .replace(/"/gm, '');
                            if (download !== null) {
                                link.download = download;
                            }
                        }
                    }
                    link.click();
                }

                if (callbackFn) {
                    callbackFn();
                }
            },
            (error) => {
                if (errorCallbackFn) {
                    errorCallbackFn(this.transformerReponseEnErreur(error));
                }
            }
        );
    }

    /**
     * Permet de traiter les erreurs http.
     *
     * @param response la reponse de l'erreur à traiter.
     * @return l'erreur traitée convertie en format Json.
     */
    transformerReponseEnErreur(response: any): any {
        const type = response.headers.get('content-type');
        if (!type?.startsWith('application/json')) {
            return response;
        }
        const decoder = new TextDecoder('utf-8');
        const domString = decoder.decode(response.error);
        return JSON.parse(domString);
    }
}

class CustomHttpParamEncoder implements HttpParameterCodec {
    encodeKey(key: string): string {
        return encodeURIComponent(key);
    }

    encodeValue(value: string): string {
        return encodeURIComponent(value);
    }

    decodeKey(key: string): string {
        return decodeURIComponent(key);
    }

    decodeValue(value: string): string {
        return decodeURIComponent(value);
    }
}
