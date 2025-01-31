import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { StepperModule } from 'primeng/stepper';
import { StepsModule } from 'primeng/steps';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { FluidModule } from 'primeng/fluid';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBar } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { FileUpload } from 'primeng/fileupload';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-creation-compte-particulier',
  imports: [ButtonModule,
    StepperModule,
    StepsModule,
    ReactiveFormsModule,
    InputTextModule,
    FormsModule,
    FloatLabel,
    FluidModule,
    DatePickerModule,
     BadgeModule, 
     ProgressBar,
     ToastModule,
     HttpClientModule, 
     CommonModule,
     FileUpload,
  
      ],
  templateUrl: './creation-compte-particulier.component.html',
  styleUrl: './creation-compte-particulier.component.scss'
})
export class CreationCompteParticulierComponent implements OnInit {


  items: MenuItem[] | undefined;

  active: number = 0;

  @Output() creationCompteParticulier = new EventEmitter<void>();

  extrait:File;

  cni:File;

  facture:File;

  certificat_residence:File;

  contrat_travail : File;

  personalInfoForm: FormGroup;

  legalInfoForm: FormGroup;

  professionalInfoForm: FormGroup;

  compteForm: FormGroup;

     files = [];

    totalSize : number = 0;

    totalSizePercent : number = 0;

  constructor(private fb: FormBuilder,private config: PrimeNG,) {}

  ecranAccueilCompteParticulier() {
    this.creationCompteParticulier.emit();
  }

  ngOnInit(): void {


  this.personalInfoForm = this.fb.group({
    civilite: [''],
    nom: [''],
    prenoms: [''],
    nom_jeune_fille: [''],
    date_naissance: [''],
    lieu_naissance: [''],
    nationalite: [''],
  });

  this.legalInfoForm = this.fb.group({
    type_piece_identite: [''],
    numero_piece_identite: [''],
    validite: [''],
    pays_residence: [''],
    nom_prenoms_representant_legal: [''],
    qualite_representant_legal: [''],
  });

  this.professionalInfoForm = this.fb.group({
    profession: [''],
    employeur: [''],
    secteur_activite: [''],
    date_embauche: [''],
    source_revenus: [''],
    montants_revenus_mensuels: [''],
  });

  this.compteForm = this.fb.group({
    numero_compte: [''],
    agence: [''],
    numero_client: [''],
    exploitant: [''],
    motif_fiche_kyc: [''],
    ouverture_compte_personne_residente: [false],
    type_operation: [''],
    produits_services_client: [''],
    operation_internationale_envisages_constates: [false],
    pays_transaction_effectues: [''],
    devise_transaction_effectues: [''],
  
  });
  }

  onActiveIndexChange(event: number) {
    this.active = event;
}

choose(event, callback) {
  callback();
}

onRemoveTemplatingFile(event, file, removeFileCallback, index) {
  removeFileCallback(event, index);
  this.totalSize -= parseInt(this.formatSize(file.size));
  this.totalSizePercent = this.totalSize / 10;
}

onClearTemplatingUpload(clear) {
  clear();
  this.totalSize = 0;
  this.totalSizePercent = 0;
}



onSelectedFiles(event) {
  this.files = event.currentFiles;
  this.files.forEach((file) => {
      this.totalSize += parseInt(this.formatSize(file.size));
  });
  this.totalSizePercent = this.totalSize / 10;
}

uploadEvent(callback) {
  callback();
}

formatSize(bytes) {
  const k = 1024;
  const dm = 3;
  const sizes = this.config.translation.fileSizeTypes;
  if (bytes === 0) {
      return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
}

}
