import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TimelineModule } from 'primeng/timeline';
import { CalendarModule } from 'primeng/calendar';
import { Router } from '@angular/router';
// PrimeNG Imports
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { SupplierService } from '../service/supplier.service';
import { SupplierForm } from '../models/supplier-form';
import { EvaluationSubmission } from '../models/evaluation.submission';
import { EvaluationStatus } from '../models/evaluation.status';

// Service
import { DmgService } from '../service/dmg.service';

@Component({
    selector: 'app-dmg-dashboard',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        StepperModule,
        ButtonModule,
        RatingModule,
        TabViewModule,
        PanelModule,
        ToastModule,
        ProgressSpinnerModule,
        DialogModule,
        ConfirmDialogModule,
        TableModule,
        FormsModule,
        DatePipe,
        DecimalPipe,
        NgFor,
        NgIf,
        NgClass,
        TimelineModule,
        CalendarModule
    ],
    providers: [MessageService, ConfirmationService, DmgService],
    templateUrl: './dmg-dashboard.component.html',
    styleUrls: ['./dmg-dashboard.component.scss']
})
export class DmgDashboardComponent implements OnInit {
    evaluationHistory: any[] = [];
    rejectDialogVisible: boolean = false;
    finalScore: number = 0;
    pendingForms: SupplierForm[] = [];
    selectedForm: SupplierForm | null = null;
    activeStep = 1;
    formGroup: FormGroup;
    isLoading = false;
    showRejectDialog = false;
    rejectReason = '';
    userRole: string = 'DMG'; // À déterminer selon l'utilisateur connecté

    beneficiaryFields = [
        { key: 'conformityOrder', label: 'Conformité de la commande' },
        { key: 'integrationService', label: 'Intégration du service' },
        { key: 'deadlineRespect', label: 'Respect des délais' },
        { key: 'advisingCapacity', label: 'Capacité de conseil' },
        { key: 'afterSalesService', label: 'Service après-vente' },
        { key: 'communication', label: 'Communication' }
    ];

    dmgFields = [
        { key: 'priceFlexibility', label: 'Flexibilité des prix' },
        { key: 'deadlineRespect', label: 'Respect des délais' },
        { key: 'communication', label: 'Communication' },
        { key: 'creditPolicy', label: 'Politique de crédit' }
    ];

    constructor(
        private fb: FormBuilder,
        private dmgService: DmgService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private supplierService: SupplierService
    ) {
        this.formGroup = this.fb.group({
            beneficiary: this.fb.group({
                direction: ['', Validators.required],
                evaluator: ['', Validators.required],
                conformityOrder: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
                integrationService: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
                deadlineRespect: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
                advisingCapacity: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
                afterSalesService: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
                communication: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
                comments: ['']
            }),
            dmg: this.fb.group({
                evaluator: ['', Validators.required],
                evaluationDate: [new Date(), Validators.required],
                priceFlexibility: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
                deadlineRespect: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
                communication: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
                creditPolicy: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
                actionPlan: ['', Validators.required]
            }),
            rejectReason: ['']
        });
    }

    ngOnInit() {
        this.loadForms();
        this.initializeEvaluationHistory();
        console.log(this.pendingForms);
        console.log(this.evaluationHistory);
        console.log(this.formGroup.value);
        console.log(this.userRole);
        console.log(this.beneficiaryFields);
        console.log(this.dmgFields);
        console.log(this.finalScore);
    }

    initializeEvaluationHistory() {
        this.evaluationHistory = [
            {
                title: "Création de l'évaluation",
                date: new Date(new Date().setDate(new Date().getDate() - 5)),
                user: 'Bénéficiaire'
            },
            {
                title: 'Soumission pour validation DMG',
                date: new Date(new Date().setDate(new Date().getDate() - 3)),
                user: ' Bénéficiaire'
            },
            {
                title: 'Validation par la DMG',
                date: new Date(new Date().setDate(new Date().getDate() - 2)),
                user: ' DMG'
            },
            {
                title: 'Évaluation finale',
                date: new Date(),
                user: ' DMG'
            }
        ];
    }

    navigateTo(route: string) {
        this.router.navigate([route]);
    }

    loadForms() {
        this.isLoading = true;

        // Charger les évaluations en fonction du rôle de l'utilisateur
        if (this.userRole === 'DMG') {
            this.dmgService.getPendingEvaluations().subscribe({
                next: (forms) => {
                    this.pendingForms = forms;
                    console.log('vrai donnee! ');
                    this.isLoading = false;
                },
                error: (_error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les évaluations'
                    });
                    this.isLoading = false;
                }
            });
        } else {
            this.dmgService.getBeneficiaryEvaluations().subscribe({
                next: (forms) => {
                    this.pendingForms = forms;
                    this.isLoading = false;
                },
                error: (_error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les évaluations'
                    });
                    this.isLoading = false;
                }
            });
        }
    }

    selectForm(form: SupplierForm) {
        this.selectedForm = form;
        this.activeStep = 2; // Formulaire d'évaluation
        this.populateForm(form);

        // Déterminer l'étape active en fonction du statut
        if (this.userRole === 'DMG') {
            switch (form.beneficiaryEvaluationStatus) {
                case EvaluationStatus.PENDING:
                    this.activeStep = 2; // Validation de l'évaluation bénéficiaire
                    break;
                case EvaluationStatus.APPROVED:
                    this.activeStep = 3; // Saisie de l'évaluation DMG
                    break;
                case EvaluationStatus.COMPLETED:
                    this.activeStep = 4; // Affichage de la note finale
                    this.calculateAndSetFinalScore();
                    break;
            }
        } else {
            // Pour le bénéficiaire
            if (form.beneficiaryEvaluationStatus === EvaluationStatus.COMPLETED) {
                this.activeStep = 4; // Affichage des résultats finaux
                this.calculateAndSetFinalScore();
            } else {
                this.activeStep = 1; // Formulaire d'évaluation
            }
        }
    }

    populateForm(form: SupplierForm) {
        // Pré-remplir le formulaire avec les données existantes
        const beneficiary = (form.beneficiaryEvaluation as { conformityOrder?: number; integrationService?: number; deadlineRespect?: number; advisingCapacity?: number; afterSalesService?: number; communication?: number; comments?: string }) || {};

        this.formGroup.patchValue({
            beneficiary: {
                direction: form.direction || '',
                evaluator: form.evaluator || '',
                conformityOrder: beneficiary.conformityOrder || 0,
                integrationService: beneficiary.integrationService || 0,
                deadlineRespect: beneficiary.deadlineRespect || 0,
                advisingCapacity: beneficiary.advisingCapacity || 0,
                afterSalesService: beneficiary.afterSalesService || 0,
                communication: beneficiary.communication || 0,
                comments: beneficiary.comments || ''
            }
        });

        // Si l'évaluation DMG existe, la remplir également
        if (form.dmgEvaluation) {
            const dmg = form.dmgEvaluation;
            this.formGroup.patchValue({
                dmg: {
                    evaluator: dmg.evaluator || '',
                    evaluationDate: dmg.evaluationDate ? new Date(dmg.evaluationDate) : new Date(),
                    priceFlexibility: dmg.priceFlexibility || 0,
                    deadlineRespect: dmg.deadlineRespect || 0,
                    communication: dmg.communication || 0,
                    creditPolicy: dmg.creditPolicy || 0,
                    actionPlan: dmg.actionPlan || ''
                }
            });
        }
    }

    calculateBeneficiaryScore(): number {
        const beneficiary = this.formGroup.get('beneficiary');
        if (!beneficiary) return 0;

        const scores = [
            beneficiary.get('conformityOrder')?.value || 0,
            beneficiary.get('integrationService')?.value || 0,
            beneficiary.get('deadlineRespect')?.value || 0,
            beneficiary.get('advisingCapacity')?.value || 0,
            beneficiary.get('afterSalesService')?.value || 0,
            beneficiary.get('communication')?.value || 0
        ];

        return scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    calculateDmgScore(): number {
        const dmg = this.formGroup.get('dmg');
        if (!dmg) return 0;

        const scores = [dmg.get('priceFlexibility')?.value || 0, dmg.get('deadlineRespect')?.value || 0, dmg.get('communication')?.value || 0, dmg.get('creditPolicy')?.value || 0];

        return scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    calculateAndSetFinalScore(): void {
        this.finalScore = this.calculateFinalScore();
    }

    calculateFinalScore(): number {
        const beneficiaryScore = this.calculateBeneficiaryScore() * 0.65;
        const dmgScore = this.calculateDmgScore() * 0.35;
        return beneficiaryScore + dmgScore;
    }

    // Soumission du formulaire bénéficiaire

    // Validation par la DMG de l'évaluation bénéficiaire
    // Validation par la DMG de l'évaluation bénéficiaire
    approveBeneficiaryEvaluation() {
        if (!this.selectedForm) return;
        this.dmgService.approveBeneficiaryEvaluation(this.selectedForm.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Évaluation du bénéficiaire approuvée'
                });

                this.activeStep = 3; // Passer à l'évaluation DMG
                this.selectedForm.beneficiaryEvaluationStatus = 'APPROVED';
                console.log('✅ Évaluation approuvée :', this.selectedForm);
            },
            error: (error) => {
                console.error("Erreur lors de l'approbation", error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: "Une erreur est survenue lors de l'approbation."
                });
            }
        });
    }

    // Rejet par la DMG de l'évaluation bénéficiaire
    openRejectDialog() {
        this.rejectDialogVisible = true;
    }

    rejectBeneficiaryEvaluation() {
        if (!this.selectedForm || !this.rejectReason) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez indiquer la raison du rejet'
            });
            return;
        }

        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir rejeter cette évaluation ?',
            header: 'Confirmation de rejet',
            acceptLabel: 'Rejeter',
            rejectLabel: 'Annuler',
            accept: () => {
                this.isLoading = true;
                this.dmgService.rejectBeneficiaryEvaluation(this.selectedForm.id, this.rejectReason).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'info',
                            summary: 'Évaluation rejetée',
                            detail: "L'évaluation a été retournée au bénéficiaire"
                        });
                        this.rejectDialogVisible = false;
                        this.rejectReason = '';
                        // Use the correct method here
                        this.resetSelection(); // Assuming you have a method to reset selection
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: "Impossible de rejeter l'évaluation"
                        });
                        this.isLoading = false;
                    }
                });
            }
        });
    }

    resetSelection() {
        // Reset the active step to the first step (list view)
        this.activeStep = 1;

        // Clear the selected form
        this.selectedForm = null;

        // Reset the form values
        this.formGroup.reset({
            beneficiary: {
                direction: '',
                evaluator: '',
                conformityOrder: 0,
                integrationService: 0,
                deadlineRespect: 0,
                advisingCapacity: 0,
                afterSalesService: 0,
                communication: 0,
                comments: ''
            },
            dmg: {
                evaluator: '',
                evaluationDate: new Date(),
                priceFlexibility: 0,
                deadlineRespect: 0,
                communication: 0,
                creditPolicy: 0,
                actionPlan: ''
            }
        });

        // Clear any dialogs
        this.rejectDialogVisible = false;
        this.rejectReason = '';

        // Refresh the forms list
        this.loadForms();
    }

    // Soumission de l'évaluation DMG
    submitDmgEvaluation() {
        if (this.formGroup.get('dmg')?.valid && this.selectedForm) {
            this.isLoading = true;

            // Créer l'objet d'évaluation DMG complet
            const submission: EvaluationSubmission = {
                supplierId: this.selectedForm.id,
                evaluator: this.formGroup.get('dmg.evaluator')?.value,
                evaluationDate: this.formGroup.get('dmg.evaluationDate')?.value,
                priceFlexibility: this.formGroup.get('dmg.priceFlexibility')?.value,
                deadlineRespect: this.formGroup.get('dmg.deadlineRespect')?.value,
                communication: this.formGroup.get('dmg.communication')?.value,
                creditPolicy: this.formGroup.get('dmg.creditPolicy')?.value,
                actionPlan: this.formGroup.get('dmg.actionPlan')?.value,
                rejectionReason: this.formGroup.get('rejectReason')?.value || '',
                averageScore: this.calculateFinalScore(),
                status: EvaluationStatus.PENDING // Replace with the appropriate status value
            };

            // Appel du service
            this.dmgService.submitDmgEvaluation(submission).subscribe({
                next: (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Évaluation DMG soumise avec succès'
                    });
                    this.finalScore = this.calculateFinalScore();
                    this.activeStep = 4; // Passer à l'affichage du score final
                    this.loadForms();
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error submitting DMG evaluation:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: "Impossible de soumettre l'évaluation DMG"
                    });
                    this.isLoading = false;
                }
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Formulaire incomplet',
                detail: 'Veuillez remplir tous les champs obligatoires'
            });
        }
    }
    resetForm() {
        this.activeStep = 1;
        this.selectedForm = null;
        this.formGroup.reset({
            beneficiary: {
                direction: '',
                evaluator: '',
                conformityOrder: 0,
                integrationService: 0,
                deadlineRespect: 0,
                advisingCapacity: 0,
                afterSalesService: 0,
                communication: 0,
                comments: ''
            },
            dmg: {
                evaluator: '',
                evaluationDate: new Date(),
                priceFlexibility: 0,
                deadlineRespect: 0,
                communication: 0,
                creditPolicy: 0,
                actionPlan: ''
            }
        });
        this.loadForms();
        this.isLoading = false;
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'PENDING':
                return 'En attente';
            case 'REJECTED':
                return 'Rejeté';
            case 'APPROVED':
                return 'Validé - En cours';
            case 'COMPLETED':
                return 'Complété';
            default:
                return status;
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'APPROVED':
                return 'bg-blue-100 text-blue-800';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100';
        }
    }

    getFinalScoreClass(): string {
        if (this.finalScore >= 4) {
            return 'text-green-600';
        } else if (this.finalScore >= 3) {
            return 'text-blue-600';
        } else if (this.finalScore >= 2) {
            return 'text-yellow-600';
        } else {
            return 'text-red-600';
        }
    }

    getFinalScoreLabel(): string {
        if (this.finalScore >= 4) {
            return 'Excellent';
        } else if (this.finalScore >= 3) {
            return 'Bon';
        } else if (this.finalScore >= 2) {
            return 'Moyen';
        } else {
            return 'Insuffisant';
        }
    }

    // Dans votre classe DmgDashboardComponent:

    // Dans votre classe DmgDashboardComponent:

    exportPdf() {
        if (!this.selectedForm) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Aucun formulaire sélectionné pour l'export"
            });
            return;
        }

        this.isLoading = true;

        // Créer un élément temporaire pour le contenu d'export
        const pdfContent = document.getElementById('pdfExportContent');

        if (!pdfContent) {
            this.isLoading = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Contenu d'export non trouvé"
            });
            return;
        }

        html2canvas(pdfContent).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Ajouter un en-tête
            pdf.setFontSize(18);
            pdf.setTextColor(75, 75, 150);
            pdf.text('Évaluation du fournisseur', 15, 15);

            // Ajouter une date
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Date d'export: ${new Date().toLocaleDateString()}`, 15, 22);

            // Ajouter l'image du contenu
            pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);

            // Ajouter un pied de page
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            pdf.text("Document généré automatiquement par le système d'évaluation des fournisseurs", 15, 290);

            // Télécharger le PDF
            pdf.save(`Evaluation_${this.selectedForm.name}_${new Date().toISOString().slice(0, 10)}.pdf`);

            this.messageService.add({
                severity: 'success',
                summary: 'Export PDF',
                detail: 'Le PDF a été téléchargé avec succès'
            });

            this.isLoading = false;
        });
    }
}
