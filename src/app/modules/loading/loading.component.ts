import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
    selector: 'app-loading',
    standalone: true,
    template: '',
    imports: []
})
export class LoadingComponent implements OnInit {
    token: string | null;
    nom: string;
    userId: string | null;
    role: string | null;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.token = params.get('token');
            this.role = params.get('role');
            this.authService.enregistrerToken('Bearer ' + this.token);
            this.authService.enregistrerRole(this.role);
            this.router.navigate(['']);
        });
    }
}
