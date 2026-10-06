import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

interface CheckItem {
  id: string;
  category: string;
  name: string;
  status: 'ok' | 'warn' | 'error';
  details: string;
  fixPrompt: string;
}

interface DoctorResponse {
  summary: {
    total: number;
    ok: number;
    warning: number;
    error: number;
    overallStatus: string;
  };
  checks: CheckItem[];
}

interface DoctorViewProps {
  onOpenGeminiWithPrompt?: (prompt: string) => void;
}

export const DoctorView: React.FC<DoctorViewProps> = ({ onOpenGeminiWithPrompt }) => {
  const [data, setData] = useState<DoctorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/doctor');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Doctor diagnostics error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const copyDoctorJson = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const copyCliCommand = () => {
    navigator.clipboard.writeText('agent-reach doctor --json');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const categories = data
    ? ['all', ...Array.from(new Set(data.checks.map((c) => c.category)))]
    : ['all'];

  const filteredChecks = data
    ? filterCategory === 'all'
      ? data.checks
      : data.checks.filter((c) => c.category === filterCategory)
    : [];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">System Doctor Diagnostics</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
              agent-reach doctor
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Validates zero-API internet routes, fallback fallbacks, public rate limits, and local cookie permissions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={copyCliCommand}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Copy command for AI coding agent"
          >
            {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Terminal className="w-3.5 h-3.5 text-cyan-400" />}
            <span>agent-reach doctor --json</span>
          </button>

          <button
            onClick={copyDoctorJson}
            disabled={!data}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition disabled:opacity-50"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy JSON</span>
          </button>

          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Testing...' : 'Re-run Doctor'}</span>
          </button>
        </div>
      </div>

      {/* Summary Scorecard */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-medium text-slate-400">Total Routes Tested</div>
            <div className="text-2xl font-bold text-white mt-1">{data.summary.total}</div>
            <div className="text-xs text-slate-500 mt-0.5">Free endpoints</div>
          </div>
          <div className="bg-slate-900/80 border border-emerald-950/40 rounded-xl p-4">
            <div className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy Routes
            </div>
            <div className="text-2xl font-bold text-emerald-300 mt-1">{data.summary.ok}</div>
            <div className="text-xs text-slate-500 mt-0.5">Zero config required</div>
          </div>
          <div className="bg-slate-900/80 border border-amber-950/40 rounded-xl p-4">
            <div className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Notices / Fallbacks
            </div>
            <div className="text-2xl font-bold text-amber-300 mt-1">{data.summary.warning}</div>
            <div className="text-xs text-slate-500 mt-0.5">Optional cookies or fallbacks</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-medium text-slate-400">System State</div>
            <div className="text-base font-semibold text-cyan-300 mt-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{data.summary.overallStatus}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Agent ready</div>
          </div>
        </div>
      )}

      {/* Category filter tabs */}
      {data && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Checks' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Checks list */}
      <div className="space-y-3">
        {loading && !data && (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400" />
            <p className="text-sm">Probing DuckDuckGo, Jina Reader, YouTube, GitHub, Reddit...</p>
          </div>
        )}

        {filteredChecks.map((item) => (
          <div
            key={item.id}
            className={`border rounded-xl p-4 transition ${
              item.status === 'ok'
                ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                : item.status === 'warn'
                ? 'bg-slate-900/90 border-amber-500/30 hover:border-amber-500/50'
                : 'bg-slate-900/90 border-rose-500/30 hover:border-rose-500/50'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.status === 'ok' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : item.status === 'warn' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                      item.status === 'ok'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : item.status === 'warn'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">{item.details}</p>
              </div>

              {/* Action / Fix suggestion */}
              <div className="sm:text-right shrink-0 pl-6 sm:pl-0">
                {onOpenGeminiWithPrompt && (
                  <button
                    onClick={() =>
                      onOpenGeminiWithPrompt(
                        `Doctor check notice for '${item.name}':\nDetails: ${item.details}\nRemediation prompt: ${item.fixPrompt}\nHow do I configure or optimize this for my coding agent?`
                      )
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-md transition"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Ask Gemini Doctor</span>
                  </button>
                )}
              </div>
            </div>

            {item.fixPrompt && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs">
                <span className="text-slate-400 font-medium shrink-0">Remediation:</span>
                <span className="text-slate-300 font-mono text-[11px] bg-slate-950 px-2 py-1 rounded border border-slate-800/80 flex-1">
                  {item.fixPrompt}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
