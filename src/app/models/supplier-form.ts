import { BeneficiaryEvaluationDTO } from './beneficiary-evaluation.dto';
import { DmgEvaluationDTO } from './dmg-evaluation.dto';

export class SupplierForm {
    id: number;
    name: string;
    address: string;
    bcNumber: string;
    description: string;
    taxType: string;
    direction: string;
    evaluator: string;
    beneficiaryEvaluationStatus: 'PENDING' | 'REJECTED' | 'APPROVED' | 'COMPLETED';
    beneficiaryEvaluation: BeneficiaryEvaluationDTO;
    dmgEvaluation?: DmgEvaluationDTO;
    finalScore?: number;
}
