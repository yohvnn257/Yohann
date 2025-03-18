import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// DTOs matching backend structure

export interface BeneficiaryEvaluationDTO {
    direction: string;
    evaluator: string;
    conformityOrder: number;
    integrationService: number;
    deadlineRespect: number;
    advisingCapacity: number;
    afterSalesService: number;
    communication: number;
    averageScore?: number;
}

export interface SupplierDTO {
    id?: number;
    name: string;
    address: string;
    bcNumber: string;
    description: string;
    taxType: string;
    beneficiaryEvaluation?: BeneficiaryEvaluationDTO;
}

export interface FinalEvaluationDTO {
    supplierId: number;
    beneficiaryScore: number;
    dmgScore: number;
    finalScore: number;
    evaluationDate: string;
}

@Injectable({
    providedIn: 'root'
})
export class SupplierService {
    formData!: SupplierDTO;
    private apiUrl = 'http://localhost:8080/api/suppliers';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}

    setFormData(formData: SupplierDTO) {
        this.formData = formData;
    }

    getFormData(): SupplierDTO | null {
        return this.formData;
    }

    // Create a new supplier
    createSupplier(supplier: SupplierDTO): Observable<SupplierDTO> {
        return this.http.post<SupplierDTO>(this.apiUrl, supplier, this.authService.getAuthHeaders());
    }

    // Get all suppliers
    getAllSuppliers(): Observable<SupplierDTO[]> {
        return this.http.get<SupplierDTO[]>(this.apiUrl, this.authService.getAuthHeaders());
    }

    // Get supplier by ID
    getSupplierById(id: number): Observable<SupplierDTO> {
        return this.http.get<SupplierDTO>(`${this.apiUrl}/${id}`, this.authService.getAuthHeaders());
    }

    // Update supplier information
    updateSupplier(supplier: SupplierDTO): Observable<SupplierDTO> {
        return this.http.put<SupplierDTO>(`${this.apiUrl}/${supplier.id}`, supplier, this.authService.getAuthHeaders());
    }

    // Delete supplier
    deleteSupplier(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, this.authService.getAuthHeaders());
    }

    // Update beneficiary evaluation
    updateBeneficiaryEvaluation(supplierId: number, evaluation: BeneficiaryEvaluationDTO): Observable<SupplierDTO> {
        return this.http.put<SupplierDTO>(`${this.apiUrl}/${supplierId}/beneficiary-evaluation`, evaluation, this.authService.getAuthHeaders());
    }

    // Update DMG evaluation

    // Get suppliers with pending beneficiary evaluations
    getPendingBeneficiaryEvaluations(): Observable<SupplierDTO[]> {
        return this.http.get<SupplierDTO[]>(`${this.apiUrl}/pending-beneficiary`, this.authService.getAuthHeaders());
    }

    // Get suppliers with pending DMG evaluations
    getPendingDmgEvaluations(): Observable<SupplierDTO[]> {
        return this.http.get<SupplierDTO[]>(`${this.apiUrl}/pending-dmg`, this.authService.getAuthHeaders());
    }

    // Calculate final evaluation
    calculateFinalEvaluation(supplierId: number): Observable<FinalEvaluationDTO> {
        return this.http.get<FinalEvaluationDTO>(`${this.apiUrl}/${supplierId}/final-evaluation`, this.authService.getAuthHeaders());
    }

    // Validate and submit full supplier evaluation
    submitFullEvaluation(supplierId: number): Observable<SupplierDTO> {
        return this.http.post<SupplierDTO>(`${this.apiUrl}/${supplierId}/submit-evaluation`, {}, this.authService.getAuthHeaders());
    }
}
