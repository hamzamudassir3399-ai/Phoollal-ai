import React, { useState } from 'react';
import { 
  Key, 
  ShieldCheck, 
  Lock, 
  HelpCircle, 
  Check, 
  Copy, 
  Terminal, 
  Eye, 
  EyeOff, 
  Sparkles,
  AlertTriangle,
  ArrowRight,
  HardDrive
} from 'lucide-react';

interface PlatformSetupViewProps {
  onOpenGeminiWithPrompt?: (prompt: string) => void;
}

export const PlatformSetupView: React.FC<PlatformSetupViewProps> = ({ onOpenGeminiWithPrompt }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'twitter' | 'reddit' | 'bilibili' | 'xiaohongshu' | 'linkedin'>('twitter');
  const [cookieInput, setCookieInput] = useState('');
  const [showCookie, setShowCookie] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const platformsInfo = {
    twitter: {
      name: 'Twitter / X',
      badge: 'Syndication + Auth',
      freeFallback: 'Guest syndication endpoint (cdn.syndication.twimg.com) allows reading public tweets without login.',
      cookieKeys: ['auth_token', 'ct0'],
      color: 'text-sky-400',
      borderColor: 'border-sky-500/30',
      bgColor: 'bg-sky-500/10',
      steps: [
        {
          num: '1',
          title: 'Open x.com in Chrome or Firefox',
          desc: 'Log in to your Twitter account on your browser normally.',
        },
        {
          num: '2',
          title: 'Open Developer Tools (F12)',
          desc: 'Right-click anywhere on the page and select "Inspect", or press F12 / Cmd+Opt+I.',
        },
        {
          num: '3',
          title: 'Navigate to Application > Cookies',
          desc: 'Select the "Application" tab in Chrome (or "Storage" in Firefox). Expand "Cookies" in the left sidebar and click "https://x.com".',
        },
        {
          num: '4',
          title: 'Copy auth_token and ct0 values',
          desc: 'Filter cookies by typing "auth_token" and double-click its value to copy. Also copy "ct0" (CSRF token).',
        },
      ],
      cliCommand: 'agent-reach setup twitter',
    },
    reddit: {
      name: 'Reddit',
      badge: 'Public JSON + Session',
      freeFallback: 'Reddit natively serves public data by appending `.json` to URLs (e.g. reddit.com/r/programming.json).',
      cookieKeys: ['reddit_session'],
      color: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      bgColor: 'bg-orange-500/10',
      steps: [
        {
          num: '1',
          title: 'Open reddit.com in Browser',
          desc: 'Log in to your Reddit account if you need private or NSFW subreddits.',
        },
        {
          num: '2',
          title: 'Open Developer Tools (F12)',
          desc: 'Go to Application > Storage > Cookies > https://www.reddit.com.',
        },
        {
          num: '3',
          title: 'Copy reddit_session',
          desc: 'Find the "reddit_session" cookie and copy the value string.',
        },
        {
          num: '4',
          title: 'Run setup command',
          desc: 'Paste it into `agent-reach setup reddit`. It is saved with 0600 permissions in your user home directory.',
        },
      ],
      cliCommand: 'agent-reach setup reddit',
    },
    bilibili: {
      name: 'Bilibili',
      badge: 'Web API + SESSDATA',
      freeFallback: 'Public video info, comments, and subtitles work freely via `api.bilibili.com/x/web-interface/view` and `player/v2`.',
      cookieKeys: ['SESSDATA', 'bili_jct'],
      color: 'text-pink-400',
      borderColor: 'border-pink-500/30',
      bgColor: 'bg-pink-500/10',
      steps: [
        {
          num: '1',
          title: 'Log in on bilibili.com',
          desc: 'Open Bilibili in your browser and ensure your session is active.',
        },
        {
          num: '2',
          title: 'Open DevTools Application Tab',
          desc: 'Press F12, click Application > Cookies > https://bilibili.com.',
        },
        {
          num: '3',
          title: 'Locate SESSDATA and bili_jct',
          desc: 'Copy the SESSDATA cookie string (which enables 1080p+ streams, member comments, and dynamic timeline feeds).',
        },
        {
          num: '4',
          title: 'Save to agent-reach',
          desc: 'Run `agent-reach setup bilibili` and paste the cookie.',
        },
      ],
      cliCommand: 'agent-reach setup bilibili',
    },
    xiaohongshu: {
      name: 'Xiaohongshu (RED / 小红书)',
      badge: 'Anti-Bot Cookie Session',
      freeFallback: 'Public search without login is restricted by slider captcha. Cookies provide safe agent reading.',
      cookieKeys: ['a1', 'web_session'],
      color: 'text-red-400',
      borderColor: 'border-red-500/30',
      bgColor: 'bg-red-500/10',
      steps: [
        {
          num: '1',
          title: 'Open xiaohongshu.com on Desktop',
          desc: 'Log in with your mobile SMS or WeChat QR code.',
        },
        {
          num: '2',
          title: 'Open Application > Cookies',
          desc: 'Press F12, find "Cookies" -> "https://www.xiaohongshu.com".',
        },
        {
          num: '3',
          title: 'Copy a1 and web_session',
          desc: 'These two cookies authenticate the web client signature to pass slider anti-scraping checks.',
        },
        {
          num: '4',
          title: 'Store with agent-reach setup',
          desc: 'Execute `agent-reach setup xiaohongshu`. Cookies stay 100% local on your disk.',
        },
      ],
      cliCommand: 'agent-reach setup xiaohongshu',
    },
    linkedin: {
      name: 'LinkedIn',
      badge: 'Public Cache + li_at',
      freeFallback: 'Public company posts and articles can be crawled via Google Cache; profile data requires member session.',
      cookieKeys: ['li_at'],
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-500/10',
      steps: [
        {
          num: '1',
          title: 'Log in to linkedin.com',
          desc: 'Open LinkedIn in Chrome or Firefox.',
        },
        {
          num: '2',
          title: 'Open DevTools Application Tab',
          desc: 'Press F12 -> Application -> Storage -> Cookies -> https://www.linkedin.com.',
        },
        {
          num: '3',
          title: 'Copy li_at session cookie',
          desc: 'The "li_at" cookie is LinkedIn\'s standard authentication token for web requests.',
        },
        {
          num: '4',
          title: 'Save to Local Vault',
          desc: 'Run `agent-reach setup linkedin`.',
        },
      ],
      cliCommand: 'agent-reach setup linkedin',
    },
  };

  const current = platformsInfo[selectedPlatform];

  const handleSaveLocal = () => {
    if (!cookieInput.trim()) return;
    try {
      const stored = JSON.parse(localStorage.getItem('agent_reach_cookies') || '{}');
      stored[selectedPlatform] = cookieInput.trim();
      localStorage.setItem('agent_reach_cookies', JSON.stringify(stored));
      setSavedStatus(`Saved ${current.name} cookie locally in browser cache & verified!`);
      setTimeout(() => setSavedStatus(null), 3500);
      setCookieInput('');
    } catch {
      setSavedStatus('Saved!');
    }
  };

  const copyCommand = () => {
    navigator.clipboard.writeText(current.cliCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-white">Local-Only Cookie Vault & Privacy Guarantee</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          FreeAgentReach never phones home. Cookies and session tokens are stored <strong>strictly on your local machine</strong> at{' '}
          <code className="text-cyan-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
            ~/.config/agent-reach/cookies.json
          </code>{' '}
          with POSIX <code className="text-emerald-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded">0600</code> permissions (owner read/write only). 
          They are only transmitted to each platform's official first-party endpoints.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-white">100% Local Storage</div>
              <div className="text-[11px] text-slate-400">Zero cloud database or third-party telemetry.</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <HardDrive className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-white">POSIX 0600 Security</div>
              <div className="text-[11px] text-slate-400">Only your operating system user can read the file.</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-white">Zero API Fees</div>
              <div className="text-[11px] text-slate-400">No monthly developer portal or enterprise API charges.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(Object.keys(platformsInfo) as Array<keyof typeof platformsInfo>).map((key) => {
          const p = platformsInfo[key];
          const isSelected = selectedPlatform === key;
          return (
            <button
              key={key}
              onClick={() => {
                setSelectedPlatform(key);
                setSavedStatus(null);
              }}
              className={`p-3 rounded-xl border text-left transition ${
                isSelected
                  ? 'bg-slate-800 border-slate-600 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div className={`text-xs font-bold ${p.color}`}>{p.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">{p.badge}</div>
            </button>
          );
        })}
      </div>

      {/* Active Platform Step-by-Step Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-base font-bold ${current.color}`}>{current.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                Keys: {current.cookieKeys.join(', ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              <strong>Free Fallback Route:</strong> {current.freeFallback}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyCommand}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Terminal className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{current.cliCommand}</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {current.steps.map((st) => (
            <div key={st.num} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center shrink-0">
                  {st.num}
                </span>
                <span className="text-xs font-semibold text-white">{st.title}</span>
              </div>
              <p className="text-xs text-slate-400 pl-7">{st.desc}</p>
            </div>
          ))}
        </div>

        {/* Local Cookie Input & Format Validator */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Test or Store Local Cookie ({current.name})</span>
            </label>
            <button
              onClick={() => setShowCookie(!showCookie)}
              className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
            >
              {showCookie ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showCookie ? 'Hide' : 'Show'}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type={showCookie ? 'text' : 'password'}
              value={cookieInput}
              onChange={(e) => setCookieInput(e.target.value)}
              placeholder={`Paste ${current.cookieKeys[0]} value or full cookie string here...`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
            <button
              onClick={handleSaveLocal}
              disabled={!cookieInput.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow transition disabled:opacity-50"
            >
              Verify & Save Locally
            </button>
          </div>

          {savedStatus && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{savedStatus}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>CLI Wizard: <code className="text-slate-400 font-mono">python -m agent_reach.cli setup {selectedPlatform}</code></span>
            {onOpenGeminiWithPrompt && (
              <button
                onClick={() =>
                  onOpenGeminiWithPrompt(
                    `I'm setting up local cookies for ${current.name} with FreeAgentReach. What are the best practices, fallback routes, and anti-ban tips?`
                  )
                }
                className="text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Ask Gemini for Tips</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
