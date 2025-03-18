import { EvaluationStatus } from './evaluation.status';

export class EvaluationSubmission {
    supplierId: number;
    evaluator: string;
    evaluationDate: Date;
    priceFlexibility: number;
    deadlineRespect: number;
    communication: number;
    creditPolicy: number;
    actionPlan: string;
    rejectionReason: string;
    averageScore: number;
    status?: EvaluationStatus;
}
