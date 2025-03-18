import { Component, ViewChild, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule, Stepper } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TabViewModule } from 'primeng/tabview';
import { RatingModule } from 'primeng/rating';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Textarea } from 'primeng/inputtextarea';
import { SupplierService } from '../service/supplier.service';
import { HttpClientModule } from '@angular/common/http';
import { SupplierDTO } from '../models/supplier.dto';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-create-formulaire',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ToggleButtonModule,
        StepperModule,
        ButtonModule,
        InputTextModule,
        FloatLabelModule,
        TabViewModule,
        RatingModule,
        PanelModule,
        ReactiveFormsModule,
        RadioButtonModule,
        ProgressSpinnerModule,
        ToastModule,
        Textarea,
        HttpClientModule,
        CardModule,
        DialogModule,
        TableModule
    ],
    templateUrl: './create-formulaire.component.html',
    styleUrls: ['./create-formulaire.component.scss'],
    providers: [MessageService]
})
export class CreateFormulaireComponent implements OnInit {
    // Propriétés existantes
    formGroup!: FormGroup;
    @ViewChild('stepperRef') stepper!: Stepper;

    activeStep: number = 1;
    name: string | undefined = undefined;
    adresse: string | undefined = undefined;
    numero_bc: string | undefined = undefined;
    description: string | undefined = undefined;
    montant: number | undefined = undefined;
    date_paiement: string | undefined = undefined;
    reference: string | undefined = undefined;

    beneficiaryFields = [
        { key: 'conformityOrder', label: 'Conformité de la commande' },
        { key: 'integrationService', label: "Conformité de l'intégration et mise en service" },
        { key: 'deadlineRespect', label: 'Respect des délais' },
        { key: 'advisingCapacity', label: 'Capacité à conseiller' },
        { key: 'afterSalesService', label: 'Qualité du service après-vente' },
        { key: 'communication', label: 'Contact relationnel - communication' }
    ];

    dmgFields = [
        { key: 'priceFlexibility', label: 'Flexibilité sur les prix' },
        { key: 'deadlineRespect', label: 'Respect des délais' },
        { key: 'communication', label: 'Contact relationnel - communication' },
        { key: 'creditPolicy', label: 'Politique de crédit' }
    ];

    isBeneficiaryValidated: boolean = false;
    isDmgValidated: boolean = false;
    isSupplierValidated: boolean = false;
    isSubmitting: boolean = false;
    submitted: boolean = false;

    // Propriétés pour l'affichage des évaluations
    evaluations: any[] = [];
    displayDialog: boolean = false;

    // Autres propriétés
    direction: any;
    evaluator: any;
    rating1: any;
    rating2: any;
    step3Valid: any;
    criteria1: any;
    criteria2: any;
    isValid: any;
    readOnly: boolean = false;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private supplierService: SupplierService,
        private router: Router
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        this.initForm();
        this.loadEvaluations();
    }

    // Getters existants
    get step1Valid(): boolean {
        return !!this.name?.trim() && !!this.adresse?.trim() && !!this.numero_bc?.trim() && !!this.description?.trim() && !!this.formGroup.get('taxe')?.valid;
    }

    get beneficiaryValid(): boolean {
        const beneficiaryGroup = this.formGroup.get('beneficiary');
        return !!beneficiaryGroup?.valid && !!beneficiaryGroup.get('direction')?.valid && !!beneficiaryGroup.get('evaluator')?.valid;
    }

    get dmgValid(): boolean {
        const dmgGroup = this.formGroup.get('dmg');
        return !!dmgGroup?.valid && !!dmgGroup.get('priceFlexibility')?.valid && !!dmgGroup.get('deadlineRespect')?.valid && !!dmgGroup.get('communication')?.valid && !!dmgGroup.get('creditPolicy')?.valid;
    }

    // Initialisation du formulaire
    initForm() {
        this.formGroup = this.fb.group({
            name: ['', Validators.required],
            adresse: ['', Validators.required],
            numero_bc: ['', Validators.required],
            description: ['', Validators.required],
            taxe: ['HT', Validators.required], // Valeur par défaut HT ajoutée
            beneficiary: this.fb.group({
                direction: ['', Validators.required],
                evaluator: ['', Validators.required],
                conformityOrder: [0, [Validators.required, Validators.min(1)]],
                integrationService: [0, [Validators.required, Validators.min(1)]],
                deadlineRespect: [0, [Validators.required, Validators.min(1)]],
                advisingCapacity: [0, [Validators.required, Validators.min(1)]],
                afterSalesService: [0, [Validators.required, Validators.min(1)]],
                communication: [0, [Validators.required, Validators.min(1)]]
            }),
            dmg: this.fb.group({
                priceFlexibility: [0, [Validators.required, Validators.min(1)]],
                deadlineRespect: [0, [Validators.required, Validators.min(1)]],
                communication: [0, [Validators.required, Validators.min(1)]],
                creditPolicy: [0, [Validators.required, Validators.min(1)]]
            })
        });

        // Synchroniser les valeurs du formulaire avec les propriétés du composant
        this.formGroup.get('name')?.valueChanges.subscribe((value) => (this.name = value));
        this.formGroup.get('adresse')?.valueChanges.subscribe((value) => (this.adresse = value));
        this.formGroup.get('numero_bc')?.valueChanges.subscribe((value) => (this.numero_bc = value));
        this.formGroup.get('description')?.valueChanges.subscribe((value) => (this.description = value));
    }

    // Méthodes liées à la gestion des évaluations
    loadEvaluations() {
        // Simulation de chargement des données
        this.evaluations = [
            {
                id: 1,
                name: 'Entreprise ABC',
                numero_bc: 'BC2023-001',
                beneficiary: { direction: "Direction des Systèmes d'Information" },
                createdAt: new Date('2023-10-15')
            },
            {
                id: 2,
                name: 'Services XYZ',
                numero_bc: 'BC2023-042',
                beneficiary: { direction: 'Direction Financière' },
                createdAt: new Date('2023-11-20')
            }
        ];
    }

    openEvaluationForm() {
        this.readOnly = false;
        this.resetForm();
        this.displayDialog = true;
        this.activeStep = 1;
    }

    closeDialog() {
        this.displayDialog = false;
        this.resetForm();
    }

    // Méthodes de validation et navigation
    validateStep1() {
        this.submitted = true;

        if (this.step1Valid) {
            this.isSupplierValidated = true;
            this.activeStep = 2;
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs obligatoires'
            });
        }
    }

    activateCallback(step: number) {
        if (step === 1) {
            this.activeStep = 1;
        } else if (step === 2) {
            if (this.step1Valid) {
                this.activeStep = 2;
            } else {
                this.validateStep1();
            }
        }
    }

    // Soumission et réinitialisation
    onSubmitEvaluation() {
        if (!this.beneficiaryValid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez compléter tous les champs obligatoires'
            });
            return;
        }

        this.isSubmitting = true;

        const formData: SupplierDTO = {
            name: this.name || '',
            address: this.adresse || '',
            bcNumber: this.numero_bc || '',
            description: this.description || '',
            taxType: this.formGroup.get('taxe')?.value || '',
            beneficiaryEvaluation: {
                direction: this.formGroup.get('beneficiary.direction')?.value || '',
                evaluator: this.formGroup.get('beneficiary.evaluator')?.value || '',
                conformityOrder: +this.formGroup.get('beneficiary.conformityOrder')?.value || 0,
                integrationService: +this.formGroup.get('beneficiary.integrationService')?.value || 0,
                deadlineRespect: +this.formGroup.get('beneficiary.deadlineRespect')?.value || 0,
                advisingCapacity: +this.formGroup.get('beneficiary.advisingCapacity')?.value || 0,
                afterSalesService: +this.formGroup.get('beneficiary.afterSalesService')?.value || 0,
                communication: +this.formGroup.get('beneficiary.communication')?.value || 0
            }
        };

        this.supplierService.createSupplier(formData).subscribe({
            next: (_response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Formulaire soumis avec succès!'
                });

                // Ajouter à la liste des évaluations locales
                const newEvaluation = {
                    id: this.evaluations.length + 1,
                    name: this.name,
                    numero_bc: this.numero_bc,
                    beneficiary: this.formGroup.get('beneficiary').value,
                    createdAt: new Date()
                };
                this.evaluations.unshift(newEvaluation);

                // Stocker les données dans le service ou rediriger
                this.supplierService.setFormData(formData);

                // Réinitialiser le formulaire et fermer le dialogue
                this.resetForm();
                this.isSubmitting = false;
                this.closeDialog();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Une erreur est survenue lors de la soumission du formulaire'
                });
                console.error('Erreur:', error);
                this.isSubmitting = false;
            }
        });
    }

    resetForm(): void {
        // Réinitialisation du formulaire
        this.formGroup.reset({
            taxe: 'HT',
            beneficiary: {
                conformityOrder: 0,
                integrationService: 0,
                deadlineRespect: 0,
                advisingCapacity: 0,
                afterSalesService: 0,
                communication: 0
            },
            dmg: {
                priceFlexibility: 0,
                deadlineRespect: 0,
                communication: 0,
                creditPolicy: 0
            }
        });

        // Réinitialisation des variables
        this.activeStep = 1;
        this.name = undefined;
        this.adresse = undefined;
        this.numero_bc = undefined;
        this.description = undefined;
        this.submitted = false;

        // Réinitialisation des états
        this.isBeneficiaryValidated = false;
        this.isDmgValidated = false;
        this.isSupplierValidated = false;
    }

    // Autres méthodes existantes
    isFormValid(): boolean {
        return (
            this.isSupplierValidated &&
            this.isBeneficiaryValidated &&
            this.isDmgValidated &&
            this.name != null &&
            this.adresse != null &&
            this.numero_bc != null &&
            this.description != null &&
            this.formGroup.get('taxe')?.value != null &&
            this.formGroup.valid
        );
    }

    validateSupplier(): boolean {
        if (!this.name || !this.adresse || !this.numero_bc || !this.description || !this.formGroup.get('taxe')?.value) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs obligatoires'
            });
            return false;
        }
        return true;
    }

    validateBeneficiary(): boolean {
        if (this.formGroup.get('beneficiary')?.valid) {
            this.isBeneficiaryValidated = true;
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Évaluation bénéficiaire validée'
            });
            return true;
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Veuillez compléter l'évaluation bénéficiaire"
            });
            return false;
        }
    }

    validateDmg() {
        const dmgForm = this.formGroup.get('dmg');
        if (dmgForm?.valid) {
            this.isDmgValidated = true;
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Évaluation DMG validée'
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs DMG'
            });
        }
    }

    calculateBeneficiaryScore(): number {
        const fields = this.beneficiaryFields;
        const values = fields.map((field) => this.formGroup.get(`beneficiary.${field.key}`)?.value || 0);
        return values.reduce((a, b) => a + b, 0) / fields.length;
    }

    calculateDmgScore(): number {
        const fields = this.dmgFields;
        const values = fields.map((field) => this.formGroup.get(`dmg.${field.key}`)?.value || 0);
        return values.reduce((a, b) => a + b, 0) / fields.length;
    }

    calculateFinalScore(): number {
        return this.calculateBeneficiaryScore() * 0.65 + this.calculateDmgScore() * 0.35;
    }
    viewEvaluation(evaluation: any) {
        // Remplir le formulaire avec les données de l'évaluation
        this.name = evaluation.name;
        this.numero_bc = evaluation.numero_bc;
        this.adresse = evaluation.adresse;
        this.description = evaluation.description;
        // Remplir le formulaire réactif avec les données de bénéficiaire
        this.formGroup.patchValue({
            taxe: evaluation.taxe || 'HT',
            beneficiary: evaluation.beneficiary || {}
        });

        // Ouvrir le dialogue en mode lecture seule
        this.readOnly = true;
        this.displayDialog = true;
    }
}
