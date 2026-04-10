import { ClaimResult } from '../types/result';
import { StageOutput } from '../types/stage';

const RESEND_API_URL = 'https://api.resend.com/emails';
const RECIPIENT = import.meta.env.VITE_RECIPIENT_EMAIL || 'svikranth40@gmail.com';

// ── Helpers ────────────────────────────────────────────────────────────────
function getStatusColor(status: string): string {
  if (status === 'Approved') return '#059669';   // emerald-600
  if (status === 'Rejected') return '#DC2626';   // red-600
  return '#D97706';                              // amber-600 → Pending
}

function getStatusBgColor(status: string): string {
  if (status === 'Approved') return '#ECFDF5';
  if (status === 'Rejected') return '#FEF2F2';
  return '#FFFBEB';
}

function getStatusIcon(status: string): string {
  if (status === 'Approved') return '✅';
  if (status === 'Rejected') return '❌';
  return '⚠️';
}

function getConfidenceLabel(score: number): string {
  if (score >= 0.80) return 'HIGH';
  if (score >= 0.65) return 'MEDIUM';
  return 'LOW';
}

function getConfidenceDotColor(score: number): string {
  if (score >= 0.80) return '#059669';
  if (score >= 0.65) return '#D97706';
  return '#DC2626';
}

const STEP_LABELS: Record<string, string> = {
  claim_analysis:  '01 · Claim Analysis',
  coverage_check:  '02 · Coverage Validation',
  document_check:  '03 · Document Validation',
  fraud_check:     '04 · Fraud / Risk Check',
  decision:        '05 · Executive Decision',
};

// ── HTML Template ──────────────────────────────────────────────────────────
function buildEmailHTML(result: ClaimResult): string {
  const statusColor   = getStatusColor(result.Status);
  const statusBg      = getStatusBgColor(result.Status);
  const statusIcon    = getStatusIcon(result.Status);
  const timestamp     = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'medium' });
  const confidencePct = Math.round(result['Confidence Score'] * 100);

  const stageRows = result['Audit Log']
    .filter((s: StageOutput) => s.step !== 'decision')
    .map((s: StageOutput) => {
      const pct = Math.round(s.confidence * 100);
      const dotColor = getConfidenceDotColor(s.confidence);
      const label = getConfidenceLabel(s.confidence);
      return `
        <tr>
          <td style="padding:14px 16px; border-bottom:1px solid #F3F4F6; vertical-align:top;">
            <span style="display:block; font-size:11px; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px;">
              ${STEP_LABELS[s.step] ?? s.step}
            </span>
            <span style="font-size:13px; color:#111827; line-height:1.6;">${s.reason}</span>
            <span style="display:block; font-size:11px; color:#9CA3AF; margin-top:5px; font-style:italic;">
              Source: ${s.source}
            </span>
          </td>
          <td style="padding:14px 16px; border-bottom:1px solid #F3F4F6; vertical-align:top; text-align:center; white-space:nowrap;">
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${dotColor}; margin-right:5px; vertical-align:middle;"></span>
            <span style="font-size:13px; font-weight:700; color:${dotColor};">${pct}%</span>
            <span style="display:block; font-size:10px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.05em; margin-top:2px;">${label}</span>
          </td>
        </tr>
      `;
    }).join('');

  const decisionStage = result['Audit Log'].find((s: StageOutput) => s.step === 'decision');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ClaimTrace AI — Audit Report</title>
</head>
<body style="margin:0; padding:0; background:#F3F4F6; font-family:'Segoe UI',Arial,sans-serif; color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6; padding:32px 0;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px; width:100%; background:#FFFFFF; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- ── Header ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a 0%,#2563EB 100%); padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px; font-weight:900; color:#FFFFFF; letter-spacing:-0.5px;">ClaimTrace AI</span>
                    <span style="display:block; font-size:11px; color:#BFDBFE; text-transform:uppercase; letter-spacing:0.1em; margin-top:2px;">Audit Workspace · AI-Powered Decision Engine</span>
                  </td>
                  <td align="right">
                    <span style="font-size:28px;">${statusIcon}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Claim Meta Bar ── -->
          <tr>
            <td style="background:#EFF6FF; border-bottom:1px solid #DBEAFE; padding:16px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:11px; color:#3B82F6; font-weight:700; text-transform:uppercase; letter-spacing:0.07em;">Claim ID</span>
                    <span style="display:block; font-size:20px; font-weight:900; color:#1E3A8A; margin-top:2px;">${result['Claim ID']}</span>
                  </td>
                  <td align="right">
                    <span style="font-size:11px; color:#6B7280;">Generated on</span>
                    <span style="display:block; font-size:12px; color:#374151; font-weight:600; margin-top:2px;">${timestamp} IST</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Verdict Banner ── -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:${statusBg}; border-radius:10px; border:1.5px solid ${statusColor}30; overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;">
                    <span style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:${statusColor};">Final Verdict</span>
                    <span style="display:block; font-size:28px; font-weight:900; color:${statusColor}; margin-top:4px; letter-spacing:-0.5px;">
                      ${result.Status.toUpperCase()}${result.Status === 'Pending' ? ' — Human Review Required' : ''}
                    </span>
                    <span style="display:block; font-size:14px; color:#374151; margin-top:10px; line-height:1.6;">${result.Reason}</span>
                  </td>
                  <td style="padding:20px 24px; text-align:right; vertical-align:top; min-width:120px;">
                    <span style="font-size:11px; color:#6B7280; text-transform:uppercase; letter-spacing:0.07em;">Overall Confidence</span>
                    <span style="display:block; font-size:44px; font-weight:900; color:${statusColor}; line-height:1; margin-top:4px;">${confidencePct}%</span>
                    <span style="font-size:11px; color:${statusColor}; font-weight:700;">${getConfidenceLabel(result['Confidence Score'])}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Section Header: Audit Trail ── -->
          <tr>
            <td style="padding:0 40px 12px;">
              <span style="font-size:13px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#374151; border-bottom:2px solid #2563EB; padding-bottom:6px; display:inline-block;">
                5-Stage AI Reasoning Audit Trail
              </span>
            </td>
          </tr>

          <!-- ── Stage Table ── -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB; border-radius:10px; overflow:hidden;">
                <thead>
                  <tr style="background:#F9FAFB;">
                    <th style="padding:10px 16px; text-align:left; font-size:11px; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid #E5E7EB;">Stage &amp; Reasoning</th>
                    <th style="padding:10px 16px; text-align:center; font-size:11px; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid #E5E7EB; width:110px;">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  ${stageRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- ── Decision Stage Summary ── -->
          ${decisionStage ? `
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <span style="font-size:11px; font-weight:800; color:#64748B; text-transform:uppercase; letter-spacing:0.07em;">05 · Executive Decision (Consensus)</span>
                    <span style="display:block; font-size:13px; color:#1E293B; margin-top:8px; line-height:1.6;">${decisionStage.reason}</span>
                    <span style="display:block; font-size:11px; color:#94A3B8; margin-top:6px; font-style:italic;">Source: ${decisionStage.source}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- ── Confidence Scale Legend ── -->
          <tr>
            <td style="padding:0 40px 28px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:16px;">
                    <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#059669; margin-right:5px; vertical-align:middle;"></span>
                    <span style="font-size:11px; color:#6B7280;">High ≥ 0.80</span>
                  </td>
                  <td style="padding-right:16px;">
                    <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#D97706; margin-right:5px; vertical-align:middle;"></span>
                    <span style="font-size:11px; color:#6B7280;">Medium 0.65 – 0.79</span>
                  </td>
                  <td>
                    <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#DC2626; margin-right:5px; vertical-align:middle;"></span>
                    <span style="font-size:11px; color:#6B7280;">Low &lt; 0.65</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="background:#1E3A8A; padding:20px 40px; border-radius:0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:13px; font-weight:700; color:#BFDBFE;">ClaimTrace AI · Audit Report</span>
                    <span style="display:block; font-size:11px; color:#93C5FD; margin-top:3px;">This is an auto-generated report. All decisions are traceable and auditable.</span>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="font-size:10px; color:#6B9EE8;">${new Date().getFullYear()} · Powered by GPT-4o</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ── Public API ────────────────────────────────────────────────────────────
export interface SendEmailResult {
  success: boolean;
  error?: string;
}

export async function sendClaimAuditEmail(result: ClaimResult): Promise<SendEmailResult> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY as string | undefined;

  if (!apiKey) {
    return { success: false, error: 'VITE_RESEND_API_KEY is not set in .env.local' };
  }

  const subject = `ClaimTrace AI · ${result['Claim ID']} — ${result.Status.toUpperCase()} (${Math.round(result['Confidence Score'] * 100)}% Confidence)`;

  const body = JSON.stringify({
    from: 'ClaimTrace AI <onboarding@resend.dev>',
    to: [RECIPIENT],
    subject,
    html: buildEmailHTML(result),
  });

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { success: false, error: (err as { message?: string }).message ?? `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { success: false, error: message };
  }
}
