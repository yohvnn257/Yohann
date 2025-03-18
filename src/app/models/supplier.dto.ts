// src/app/models/supplier.dto.ts
import { BeneficiaryEvaluationDTO } from './beneficiary-evaluation.dto';
import { DmgEvaluationDTO } from './dmg-evaluation.dto';

export class SupplierDTO {
    id?: number;
    name: string;
    address: string;
    bcNumber: string;
    description: string;
    taxType: string;
    beneficiaryEvaluationStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'APPROVED';
    beneficiaryEvaluation: BeneficiaryEvaluationDTO;
    dmgEvaluation?: DmgEvaluationDTO; // Optionnel tant que DMG n'a pas validé l'évaluation
    globalScore?: number; // Score global calculé côté backend
}
