import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { registerLocaleData, TitleCasePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { DatePipe, LocationStrategy } from '@angular/common';
import { HashLocationStrategy } from '@angular/common';
import { MessageService } from 'primeng/api';
import { DEFAULT_TIMEOUT } from './app/shared/interceptors/timeout-interceptor';
import { ApiUrlInterceptor } from './app/shared/interceptors/api-url-interceptor';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from './app/service/auth.service';
import { AuthGuard } from '../src/app/shared/guards/auth.guard';
import { JwtInterceptor } from './app/shared/interceptors/jwt-interceptor';
import localeFr from '@angular/common/locales/fr';
import { BrowserModule } from '@angular/platform-browser';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

registerLocaleData(localeFr);

export function tokenGetter(): string {
    const token = localStorage.getItem('token');
    return token || '';
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch(), withInterceptorsFromDi()),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        importProvidersFrom(
            BrowserModule,
            BrowserAnimationsModule,
            JwtModule.forRoot({
                config: { tokenGetter: tokenGetter }
            }),
            TranslateModule.forRoot({
                defaultLanguage: 'FR',
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient]
                }
            })
        ),
        AuthGuard,
        AuthService,
        JwtHelperService,
        TitleCasePipe,
        CurrencyPipe,
        MessageService,
        ConfirmationService,
        DatePipe,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiUrlInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        { provide: DEFAULT_TIMEOUT, useValue: 60000 },
        { provide: LOCALE_ID, useValue: 'fr' },
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ]
};
