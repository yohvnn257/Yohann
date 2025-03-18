import { EvaluationStatus } from './evaluation.status';

export class DmgEvaluationDTO {
    supplierId: number;
    evaluator: string;
    evaluationDate: Date;
    priceFlexibility: number;
    deadlineRespect: number;
    communication: number;
    creditPolicy: number;
    actionPlan?: string;
    rejectReason?: string;
    averageScore?: number;
    status?: EvaluationStatus;
}
