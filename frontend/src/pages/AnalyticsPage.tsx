import React, { useMemo } from 'react';
import useClaimStore from '../store/useClaimStore';
import { ClaimResult } from '../lib/types/result';

// ─── Helpers ────────────────────────────────────────────────────────────────

function pct(part: number, total: number) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

function avg(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

const STAGE_LABELS: Record<string, string> = {
  claim_analysis: 'Claim Analysis',
  coverage_check: 'Coverage Validation',
  document_check: 'Document Validation',
  fraud_check: 'Fraud Check',
  decision: 'Decision',
};

const STAGE_ORDER = ['claim_analysis', 'coverage_check', 'document_check', 'fraud_check', 'decision'];

const STATUS_COLOR: Record<string, string> = {
  Approved: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  Rejected: 'text-red-600 bg-red-50 border-red-200',
  Pending: 'text-amber-600 bg-amber-50 border-amber-200',
};

const STATUS_BAR_COLOR: Record<string, string> = {
  Approved: 'bg-emerald-500',
  Rejected: 'bg-red-500',
  Pending: 'bg-amber-400',
};

const CONF_BAND_COLOR = (score: number) =>
  score >= 0.8 ? 'bg-emerald-500' : score >= 0.65 ? 'bg-amber-400' : 'bg-red-500';

const CONF_BAND_LABEL = (score: number) =>
  score >= 0.8 ? 'High' : score >= 0.65 ? 'Medium' : 'Low';

// ─── Sub-components ─────────────────────────────────────────────────────────

const StatCard: React.FC<{
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}> = ({ icon, label, value, sub, accent = 'text-gray-900' }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-xs font-black uppercase tracking-widest text-gray-400">{label}</span>
      <span className="material-symbols-outlined text-[22px] text-gray-300">{icon}</span>
    </div>
    <span className={`text-3xl font-black tracking-tight ${accent}`}>{value}</span>
    {sub && <span className="text-xs text-gray-400 font-medium -mt-1">{sub}</span>}
  </div>
);

const SectionTitle: React.FC<{ icon: string; title: string; sub?: string }> = ({ icon, title, sub }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="material-symbols-outlined text-[20px] text-blue-500">{icon}</span>
    <div>
      <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider leading-none">{title}</h2>
      {sub && <p className="text-xs text-gray-400 font-medium mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Empty State ────────────────────────────────────────────────────────────

const EmptyAnalytics: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full py-24 text-center gap-4">
    <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-2">
      <span className="material-symbols-outlined text-[40px] text-blue-300">monitoring</span>
    </div>
    <h2 className="text-lg font-black text-gray-800">No analytics yet</h2>
    <p className="text-sm text-gray-400 max-w-xs font-medium">
      Process one or more claims on the <span className="text-blue-600 font-bold">Claims Dashboard</span> and come back here to see your full analytics report.
    </p>
  </div>
);

// ─── Main Page ───────────────────────────────────────────────────────────────

const AnalyticsPage: React.FC = () => {
  const { auditHistory } = useClaimStore();
  const history: ClaimResult[] = auditHistory;

  const stats = useMemo(() => {
    const total = history.length;
    const approved = history.filter(r => r.Status === 'Approved').length;
    const rejected = history.filter(r => r.Status === 'Rejected').length;
    const pending = history.filter(r => r.Status === 'Pending').length;
    const avgConf = avg(history.map(r => r['Confidence Score']));
    const highConf = history.filter(r => r['Confidence Score'] >= 0.8).length;
    const lowConf = history.filter(r => r['Confidence Score'] < 0.65).length;
    const inconsistent = history.filter(r => r.isConsistent === false).length;

    // Stage avg confidence (excluding decision stage)
    const stageAvgs: Record<string, number> = {};
    for (const step of STAGE_ORDER.slice(0, 4)) {
      const vals = history
        .flatMap(r => r['Audit Log'])
        .filter(s => s.step === step)
        .map(s => s.confidence);
      stageAvgs[step] = avg(vals);
    }

    // Confidence distribution buckets
    const buckets = [
      { label: '0.90–1.00', min: 0.90, max: 1.01 },
      { label: '0.80–0.89', min: 0.80, max: 0.90 },
      { label: '0.65–0.79', min: 0.65, max: 0.80 },
      { label: '0.50–0.64', min: 0.50, max: 0.65 },
      { label: '< 0.50',    min: 0,    max: 0.50 },
    ].map(b => ({
      ...b,
      count: history.filter(r => r['Confidence Score'] >= b.min && r['Confidence Score'] < b.max).length,
    }));

    return { total, approved, rejected, pending, avgConf, highConf, lowConf, inconsistent, stageAvgs, buckets };
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
        <EmptyAnalytics />
      </div>
    );
  }

  const maxBucket = Math.max(...stats.buckets.map(b => b.count), 1);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FAFB] p-8">
      <div className="space-y-8">

        {/* ── Page Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Analytics</p>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Claims Intelligence Report</h1>
            <p className="text-sm text-gray-400 font-medium mt-1">
              Aggregated insights from {stats.total} processed claim{stats.total !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-xs font-bold text-gray-400 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-blue-400">database</span>
            {stats.total} claim{stats.total !== 1 ? 's' : ''} in history
          </div>
        </div>

        {/* ── Row 1 — KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon="receipt_long" label="Total Processed" value={stats.total} sub="All-time claims" />
          <StatCard
            icon="check_circle"
            label="Approved"
            value={`${stats.approved} (${pct(stats.approved, stats.total)}%)`}
            sub={`${stats.total - stats.approved} not approved`}
            accent="text-emerald-600"
          />
          <StatCard
            icon="cancel"
            label="Rejected"
            value={`${stats.rejected} (${pct(stats.rejected, stats.total)}%)`}
            sub="Coverage / fraud flags"
            accent="text-red-600"
          />
          <StatCard
            icon="pending"
            label="Pending Review"
            value={`${stats.pending} (${pct(stats.pending, stats.total)}%)`}
            sub="Routed to human review"
            accent="text-amber-600"
          />
        </div>

        {/* ── Row 2 — Secondary KPIs ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon="speed"
            label="Avg Confidence"
            value={`${(stats.avgConf * 100).toFixed(1)}%`}
            sub="Weighted pipeline score"
            accent={stats.avgConf >= 0.8 ? 'text-emerald-600' : stats.avgConf >= 0.65 ? 'text-amber-600' : 'text-red-600'}
          />
          <StatCard
            icon="workspace_premium"
            label="High Confidence"
            value={`${stats.highConf}`}
            sub={`≥ 80% confidence · ${pct(stats.highConf, stats.total)}% of claims`}
            accent="text-blue-700"
          />
          <StatCard
            icon="warning"
            label="Low Confidence"
            value={`${stats.lowConf}`}
            sub={`< 65% · flagged for review`}
            accent={stats.lowConf > 0 ? 'text-red-600' : 'text-gray-900'}
          />
          <StatCard
            icon="policy"
            label="Consistency Flags"
            value={`${stats.inconsistent}`}
            sub="Decisions contradicting stage outputs"
            accent={stats.inconsistent > 0 ? 'text-amber-700' : 'text-gray-900'}
          />
        </div>

        {/* ── Row 3 — Decision Distribution + Stage Confidence ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Decision Distribution */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <SectionTitle icon="donut_large" title="Decision Distribution" sub="Breakdown by verdict" />
            <div className="space-y-4">
              {(['Approved', 'Rejected', 'Pending'] as const).map(status => {
                const count = history.filter(r => r.Status === status).length;
                const percentage = pct(count, stats.total);
                return (
                  <div key={status}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${STATUS_COLOR[status]}`}>
                        {status}
                      </span>
                      <span className="text-sm font-black text-gray-800">{count} <span className="text-xs font-bold text-gray-400">({percentage}%)</span></span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${STATUS_BAR_COLOR[status]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mini donut representation (CSS circles) */}
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-around text-center">
              {(['Approved', 'Rejected', 'Pending'] as const).map(status => {
                const count = history.filter(r => r.Status === status).length;
                return (
                  <div key={status} className="flex flex-col items-center gap-1">
                    <span className={`text-2xl font-black ${
                      status === 'Approved' ? 'text-emerald-600' :
                      status === 'Rejected' ? 'text-red-600' : 'text-amber-600'
                    }`}>{count}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{status}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stage Confidence Averages */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <SectionTitle icon="stacked_bar_chart" title="Avg Confidence by Stage" sub="Across all processed claims" />
            <div className="space-y-4">
              {STAGE_ORDER.slice(0, 4).map(step => {
                const score = stats.stageAvgs[step] ?? 0;
                const pctVal = Math.round(score * 100);
                return (
                  <div key={step}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-gray-600">{STAGE_LABELS[step]}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase ${
                          score >= 0.8 ? 'text-emerald-600' : score >= 0.65 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {CONF_BAND_LABEL(score)}
                        </span>
                        <span className="text-xs font-black text-gray-800">{pctVal}%</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${CONF_BAND_COLOR(score)}`}
                        style={{ width: `${pctVal}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />High ≥ 80%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Medium 65–79%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Low &lt; 65%</span>
            </div>
          </div>
        </div>

        {/* ── Row 4 — Confidence Distribution + Risk Summary ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Confidence Score Distribution */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <SectionTitle icon="bar_chart" title="Confidence Score Distribution" sub="Claims grouped by overall confidence band" />
            <div className="space-y-3">
              {stats.buckets.map(b => (
                <div key={b.label} className="flex items-center gap-4">
                  <span className="text-[11px] font-bold text-gray-500 w-20 shrink-0">{b.label}</span>
                  <div className="flex-1 h-6 bg-gray-50 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full rounded-lg transition-all duration-700 ${
                        b.min >= 0.80 ? 'bg-emerald-400' :
                        b.min >= 0.65 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${Math.round((b.count / maxBucket) * 100)}%`, minWidth: b.count > 0 ? '8px' : '0' }}
                    />
                  </div>
                  <span className="text-sm font-black text-gray-700 w-6 text-right">{b.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Summary */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <SectionTitle icon="gpp_maybe" title="Risk & Quality Summary" sub="Overall pipeline health indicators" />
            <div className="space-y-3">
              {[
                {
                  label: 'Approval Rate',
                  value: `${pct(stats.approved, stats.total)}%`,
                  icon: 'trending_up',
                  color: stats.approved >= stats.total * 0.5 ? 'text-emerald-600' : 'text-amber-600',
                },
                {
                  label: 'Rejection Rate',
                  value: `${pct(stats.rejected, stats.total)}%`,
                  icon: 'trending_down',
                  color: 'text-red-600',
                },
                {
                  label: 'Human Review Rate',
                  value: `${pct(stats.pending, stats.total)}%`,
                  icon: 'person_search',
                  color: 'text-amber-600',
                },
                {
                  label: 'High Confidence Rate',
                  value: `${pct(stats.highConf, stats.total)}%`,
                  icon: 'workspace_premium',
                  color: 'text-blue-600',
                },
                {
                  label: 'Avg Pipeline Score',
                  value: `${(stats.avgConf * 100).toFixed(1)}%`,
                  icon: 'speed',
                  color: stats.avgConf >= 0.8 ? 'text-emerald-600' : 'text-amber-600',
                },
                {
                  label: 'Consistency Issue Rate',
                  value: stats.total > 0 ? `${pct(stats.inconsistent, stats.total)}%` : '—',
                  icon: 'report_problem',
                  color: stats.inconsistent > 0 ? 'text-red-600' : 'text-gray-500',
                },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-gray-300">{item.icon}</span>
                    <span className="text-xs font-bold text-gray-600">{item.label}</span>
                  </div>
                  <span className={`text-sm font-black ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 5 — Recent Claims Table ── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-4">
            <SectionTitle icon="history" title="All Processed Claims" sub={`${history.length} claim${history.length !== 1 ? 's' : ''} in audit history • Most recent first`} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-gray-50 border-y border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-[11px] font-black uppercase tracking-wider text-gray-400">#</th>
                  <th className="px-6 py-3 text-[11px] font-black uppercase tracking-wider text-gray-400">Claim ID</th>
                  <th className="px-6 py-3 text-[11px] font-black uppercase tracking-wider text-gray-400">Verdict</th>
                  <th className="px-6 py-3 text-[11px] font-black uppercase tracking-wider text-gray-400">Confidence</th>
                  <th className="px-6 py-3 text-[11px] font-black uppercase tracking-wider text-gray-400">Stage Profile</th>
                  <th className="px-6 py-3 text-[11px] font-black uppercase tracking-wider text-gray-400">Consistency</th>
                  <th className="px-6 py-3 text-[11px] font-black uppercase tracking-wider text-gray-400">Primary Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.map((r, i) => {
                  const stageConfs = r['Audit Log'].slice(0, 4).map(s => s.confidence);
                  return (
                    <tr key={`${r['Claim ID']}-${i}`} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-gray-300">{i + 1}</td>
                      <td className="px-6 py-4 font-black text-gray-900">{r['Claim ID']}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${STATUS_COLOR[r.Status] ?? 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                          {r.Status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${CONF_BAND_COLOR(r['Confidence Score'])}`}
                              style={{ width: `${Math.round(r['Confidence Score'] * 100)}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs font-bold text-gray-700">
                            {(r['Confidence Score'] * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {stageConfs.map((sc, si) => (
                            <div
                              key={si}
                              title={`Stage ${si + 1}: ${(sc * 100).toFixed(0)}%`}
                              className={`w-4 h-4 rounded-sm ${CONF_BAND_COLOR(sc)}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {r.isConsistent === false ? (
                          <span className="flex items-center gap-1 text-amber-600 text-[10px] font-black uppercase">
                            <span className="material-symbols-outlined text-[14px]">warning</span> Flag
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> OK
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 font-medium max-w-[280px]">
                        <span className="line-clamp-2">{r.Reason}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer legend ── */}
        <div className="flex items-center justify-center gap-8 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />High ≥ 80%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />Medium 65–79%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />Low &lt; 65%
          </span>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;
