import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { CreationCompteParticulierComponent } from '../creation-compte-particulier/creation-compte-particulier.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';
@Component({
  selector: 'app-particuliers',
  imports: [ButtonModule,TableModule,InputIcon, IconField, InputTextModule,CreationCompteParticulierComponent,NgSwitch,NgSwitchCase],
  templateUrl: './particuliers.component.html',
  styleUrl: './particuliers.component.scss'
})
export class ParticuliersComponent implements  OnInit {

  page:string = 'Accueil';
  listeClientParticuliers: any[] = ['sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd','sddsgd'];

  ngOnInit(): void {
    this.page = 'Accueil';
  }

  ecranAcueil(){
    this.page = 'Accueil';
  }

  ecranCreationCompte(){
    this.page = 'creation';
  }

}
