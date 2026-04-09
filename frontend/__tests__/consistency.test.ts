import { validateConsistency } from '../src/lib/validators/consistency';
import { StageOutput } from '../src/lib/types/stage';

describe('Consistency Validator', () => {
  it('identifies no contradiction for correct decision and correct stages', () => {
    const auditLog: StageOutput[] = [
      { step: 'claim_analysis', reason: 'ok', confidence: 0.9, source: 'sys' },
      { step: 'coverage_check', reason: 'ok', confidence: 0.9, source: 'sys' },
      { step: 'document_check', reason: 'ok', confidence: 0.9, source: 'sys' },
      { step: 'fraud_check', reason: 'ok', confidence: 0.9, source: 'sys' },
      { step: 'decision', reason: 'ok', confidence: 0.9, source: 'sys', result: 'Approved' }
    ];
    const { isConsistent, issues } = validateConsistency(auditLog, 'Approved');
    expect(isConsistent).toBe(true);
    expect(issues.length).toBe(0);
  });

  it('warns when final is Approved but stages have low confidence', () => {
    const auditLog: StageOutput[] = [
      { step: 'claim_analysis', reason: 'ok', confidence: 0.9, source: 'sys' },
      { step: 'coverage_check', reason: 'ok', confidence: 0.5, source: 'sys' }, // Low confidence
      { step: 'decision', reason: 'ok', confidence: 0.9, source: 'sys', result: 'Approved' }
    ];
    const { isConsistent, issues } = validateConsistency(auditLog, 'Approved');
    expect(isConsistent).toBe(false);
    expect(issues[0]).toContain('One or more stages have low confidence');
  });

  it('warns when decision stage result contradicts final status', () => {
    const auditLog: StageOutput[] = [
      { step: 'claim_analysis', reason: 'ok', confidence: 0.9, source: 'sys' },
      { step: 'decision', reason: 'ok', confidence: 0.9, source: 'sys', result: 'Rejected' }
    ];
    const { isConsistent, issues } = validateConsistency(auditLog, 'Approved');
    expect(isConsistent).toBe(false);
    expect(issues[0]).toContain('does not match final status');
  });
});
