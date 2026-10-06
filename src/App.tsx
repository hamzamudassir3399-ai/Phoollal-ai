import React, { useState } from 'react';
import { 
  Activity, 
  Terminal, 
  Globe, 
  Key, 
  Bot, 
  FolderTree, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';

import { DoctorView } from './components/DoctorView';
import { PlaygroundView } from './components/PlaygroundView';
import { PlatformSetupView } from './components/PlatformSetupView';
import { AgentConfigView } from './components/AgentConfigView';
import { CodeExplorerView } from './components/CodeExplorerView';
import { GeminiChatDrawer } from './components/GeminiChatDrawer';

type MainView = 'doctor' | 'playground' | 'platforms' | 'agent-config' | 'code';

export default function App() {
  const [currentView, setCurrentView] = useState<MainView>('doctor');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPrompt, setChatPrompt] = useState('');
  const [quickCopied, setQuickCopied] = useState(false);

  const quickInstallCmd = 'curl -fsSL https://ais-dev-nq6mg2x4qiezoe5g3ygxr6-49371397759.asia-southeast1.run.app/install.sh | bash';

  const copyQuickInstall = () => {
    navigator.clipboard.writeText(quickInstallCmd);
    setQuickCopied(true);
    setTimeout(() => setQuickCopied(false), 2000);
  };

  const openGeminiWith = (prompt: string) => {
    setChatPrompt(prompt);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-mono font-bold text-lg">
              FR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">FreeAgentReach</h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  v1.0.0 Zero $0 APIs
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Internet CLI & MCP suite for Cursor & Claude Code
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setCurrentView('doctor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'doctor'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </button>

            <button
              onClick={() => setCurrentView('playground')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'playground'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Playground</span>
            </button>

            <button
              onClick={() => setCurrentView('platforms')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'platforms'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Local Cookies</span>
            </button>

            <button
              onClick={() => setCurrentView('agent-config')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'agent-config'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Agent Rules & MCP</span>
            </button>

            <button
              onClick={() => setCurrentView('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'code'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Source Files</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 hover:from-emerald-600/30 hover:to-cyan-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Gemini Intelligence</span>
              <span className="sm:hidden">Gemini</span>
            </button>

            <a
              href="/api/download/cli.py"
              download="agent_reach.py"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
              title="Download standalone Python CLI script"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">.py script</span>
            </a>
          </div>
        </div>

        {/* Mobile View Selector Bar */}
        <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-800/80 gap-1 bg-slate-950">
          {(['doctor', 'playground', 'platforms', 'agent-config', 'code'] as MainView[]).map((v) => (
            <button
              key={v}
              onClick={() => setCurrentView(v)}
              className={`px-3 py-1 rounded-lg text-xs capitalize whitespace-nowrap ${
                currentView === v
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400'
              }`}
            >
              {v.replace('-', ' ')}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full">
        {/* Quick One-Liner Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                1-Command Install & Update
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Install the CLI on your development machine or container. Gives Cursor and Claude Code internet superpowers in seconds:
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 max-w-xl overflow-x-auto">
            <span className="text-emerald-400 shrink-0">$</span>
            <span className="truncate flex-1 select-all">{quickInstallCmd}</span>
            <button
              onClick={copyQuickInstall}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shrink-0"
              title="Copy 1-liner to clipboard"
            >
              {quickCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Render Active View */}
        {currentView === 'doctor' && (
          <DoctorView onOpenGeminiWithPrompt={openGeminiWith} />
        )}

        {currentView === 'playground' && (
          <PlaygroundView onOpenGeminiWithPrompt={openGeminiWith} />
        )}

        {currentView === 'platforms' && (
          <PlatformSetupView onOpenGeminiWithPrompt={openGeminiWith} />
        )}

        {currentView === 'agent-config' && (
          <AgentConfigView />
        )}

        {currentView === 'code' && (
          <CodeExplorerView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Open Source • Zero Paid APIs Required • 100% Local Cookies</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>agent-reach --version 1.0.0</span>
            <span>•</span>
            <button onClick={() => setCurrentView('doctor')} className="hover:text-emerald-400">
              Run doctor
            </button>
            <span>•</span>
            <button onClick={() => setCurrentView('agent-config')} className="hover:text-emerald-400">
              Cursor rules
            </button>
          </div>
        </div>
      </footer>

      {/* Gemini Chatbot Drawer */}
      <GeminiChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialPrompt={chatPrompt}
      />
    </div>
  );
}
