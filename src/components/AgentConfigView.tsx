import React, { useState } from 'react';
import { 
  Bot, 
  Terminal, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const AgentConfigView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cursor' | 'claude' | 'install' | 'mcp'>('cursor');
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const cursorRulesContent = `# FreeAgentReach - Coding Agent Internet Access Rules
# Drop this into your repository root as .cursorrules or .cursor/rules/web-access.mdc

You have access to the zero-paid-API command-line utility \`agent-reach\`.
Always use \`agent-reach\` when you need to research documentation, read URLs, or inspect GitHub code.

## Standard Commands (Always append --json for deterministic parsing):
1. Web Search:
   Run: \`agent-reach search "<query>" --limit 8 --json\`
   Use this to find relevant official documentation, packages, or error fixes.

2. Web Page Reading:
   Run: \`agent-reach web "<url>" --json\`
   Extracts token-efficient, clean Markdown from any documentation or blog post.
   If a website blocks direct requests, agent-reach automatically falls back to Jina Reader (r.jina.ai).

3. YouTube Video Transcripts:
   Run: \`agent-reach youtube transcript "<video_id_or_url>" --json\`
   Extracts timestamped transcripts and tutorials without requiring Google Cloud API keys.

4. Public GitHub Repositories:
   Run: \`agent-reach github file "<owner/repo>" "<filepath>" --json\`
   Reads raw source code directly from raw.githubusercontent.com without rate-limit token requirements.

5. System Health Check:
   Run: \`agent-reach doctor --json\`
   If a request fails, run doctor diagnostics to inspect which routes are healthy and how to remediate.

## Guidelines:
- Never hallucinate API parameters when you can verify them via \`agent-reach web <url>\`.
- Prefer passing \`--json\` so output can be parsed cleanly.
`;

  const claudeCodeContent = `# CLAUDE.md - Coding Guidelines & Free Web Access

## Internet Access via FreeAgentReach
You have access to the local CLI tool \`agent-reach\` to browse the internet without paid API keys:

- **Search the Web**: \`agent-reach search "query" --json\`
- **Read Documentation**: \`agent-reach web "https://example.com" --json\`
- **Extract YouTube Transcripts**: \`agent-reach youtube transcript "video_id" --json\`
- **Inspect Public GitHub Files**: \`agent-reach github file "owner/repo" "path/to/file" --json\`
- **Parse RSS Feeds**: \`agent-reach rss "https://feed.xml" --json\`
- **Doctor Diagnostics**: \`agent-reach doctor --json\`

When researching libraries or fixing build errors, first search, then read the target docs with \`agent-reach web\`.
`;

  const mcpConfigContent = `{
  "mcpServers": {
    "agent-reach": {
      "command": "python3",
      "args": ["-m", "agent_reach.mcp_server"],
      "env": {}
    }
  }
}`;

  const installScripts = {
    pip: "pip install -U agent-reach",
    uv: "uv tool install --upgrade agent-reach",
    standalone: "curl -fsSL https://ais-dev-nq6mg2x4qiezoe5g3ygxr6-49371397759.asia-southeast1.run.app/install.sh | bash",
    singleFile: "curl -fsSL https://ais-dev-nq6mg2x4qiezoe5g3ygxr6-49371397759.asia-southeast1.run.app/api/download/cli.py -o ~/.local/bin/agent-reach && chmod +x ~/.local/bin/agent-reach"
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Bot className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-white">Agent Integration (Cursor, Claude Code, MCP)</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Coding agents work best when they don't have to guess or memorize CLI parameters. Drop these rule files into your project root, and Cursor or Claude Code will automatically invoke <code className="text-cyan-400 font-mono">agent-reach</code> with clean JSON output whenever they need live internet docs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('cursor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'cursor'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Cursor (.cursorrules)</span>
        </button>

        <button
          onClick={() => setActiveTab('claude')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'claude'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Claude Code (CLAUDE.md)</span>
        </button>

        <button
          onClick={() => setActiveTab('mcp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'mcp'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>MCP Server (JSON-RPC)</span>
        </button>

        <button
          onClick={() => setActiveTab('install')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'install'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>1-Command Install & Update</span>
        </button>
      </div>

      {/* CURSOR TAB */}
      {activeTab === 'cursor' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                Cursor Rules Configuration (<code className="text-cyan-400 font-mono text-xs">.cursorrules</code>)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Save as <code className="text-white font-mono text-xs">.cursorrules</code> or in <code className="text-white font-mono text-xs">.cursor/rules/web-access.mdc</code> in your repo.
              </p>
            </div>
            <button
              onClick={() => copyText(cursorRulesContent, 'cursor')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition shadow-sm"
            >
              {copied === 'cursor' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'cursor' ? 'Copied Rules!' : 'Copy .cursorrules'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed max-h-96">
            {cursorRulesContent}
          </pre>
        </div>
      )}

      {/* CLAUDE TAB */}
      {activeTab === 'claude' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                Claude Code Guidelines (<code className="text-purple-400 font-mono text-xs">CLAUDE.md</code>)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Place this snippet in your project's root <code className="text-white font-mono text-xs">CLAUDE.md</code>.
              </p>
            </div>
            <button
              onClick={() => copyText(claudeCodeContent, 'claude')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition shadow-sm"
            >
              {copied === 'claude' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'claude' ? 'Copied CLAUDE.md!' : 'Copy CLAUDE.md'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed max-h-96">
            {claudeCodeContent}
          </pre>
        </div>
      )}

      {/* MCP TAB */}
      {activeTab === 'mcp' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                Model Context Protocol (MCP) Server Configuration
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Add to <code className="text-white font-mono text-xs">claude_desktop_config.json</code> or Cursor MCP settings.
              </p>
            </div>
            <button
              onClick={() => copyText(mcpConfigContent, 'mcp')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-sm"
            >
              {copied === 'mcp' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'mcp' ? 'Copied Config!' : 'Copy MCP JSON'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs text-emerald-300 font-mono overflow-x-auto leading-relaxed">
            {mcpConfigContent}
          </pre>

          <div className="text-xs text-slate-400 space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="font-semibold text-slate-200">Tools automatically registered via MCP:</div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
              <li><code className="text-cyan-400 font-mono">web_read(url, fallback)</code> - Read web pages as clean Markdown</li>
              <li><code className="text-cyan-400 font-mono">web_search(query, limit)</code> - Live web search without paid API keys</li>
              <li><code className="text-cyan-400 font-mono">youtube_transcript(video_id, lang)</code> - Extract timestamped video captions</li>
              <li><code className="text-cyan-400 font-mono">github_read_file(repo, path, branch)</code> - Read public repo code</li>
              <li><code className="text-cyan-400 font-mono">rss_read(feed_url, limit)</code> - Parse RSS and Atom feeds</li>
              <li><code className="text-cyan-400 font-mono">doctor_check()</code> - Autonomous route health diagnosis</li>
            </ul>
          </div>
        </div>
      )}

      {/* INSTALL TAB */}
      {activeTab === 'install' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              1-Command Install & Update Options
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose the package installation method that matches your environment:
            </p>
          </div>

          <div className="space-y-3">
            {/* uv tool */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-white">Recommended: uv tool (Fastest isolated install)</div>
                <div className="text-xs font-mono text-cyan-400">{installScripts.uv}</div>
              </div>
              <button
                onClick={() => copyText(installScripts.uv, 'uv')}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
              >
                {copied === 'uv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* pip */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-white">Standard: Python pip</div>
                <div className="text-xs font-mono text-emerald-400">{installScripts.pip}</div>
              </div>
              <button
                onClick={() => copyText(installScripts.pip, 'pip')}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
              >
                {copied === 'pip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Standalone 1-liner */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-white">Zero Dependencies: Standalone Shell 1-Liner</div>
                <div className="text-xs font-mono text-amber-400 truncate max-w-md">{installScripts.standalone}</div>
              </div>
              <button
                onClick={() => copyText(installScripts.standalone, 'standalone')}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
              >
                {copied === 'standalone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-300">
              Download standalone executable Python script directly:
            </div>
            <a
              href="/api/download/cli.py"
              download="agent_reach.py"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download agent_reach.py</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
