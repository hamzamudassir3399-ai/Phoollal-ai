import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Youtube, 
  Github, 
  Rss, 
  Play, 
  Copy, 
  Check, 
  Sparkles, 
  Terminal, 
  FileText, 
  ExternalLink, 
  AlertCircle,
  Clock,
  Layers
} from 'lucide-react';

interface PlaygroundViewProps {
  onOpenGeminiWithPrompt?: (prompt: string) => void;
}

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({ onOpenGeminiWithPrompt }) => {
  const [activeTab, setActiveTab] = useState<'web' | 'search' | 'youtube' | 'github' | 'rss'>('web');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Web Reader State
  const [webUrl, setWebUrl] = useState('https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API');
  const [webFallback, setWebFallback] = useState('auto');
  const [webResult, setWebResult] = useState<any>(null);

  // Web Search State
  const [searchQuery, setSearchQuery] = useState('react 19 actions best practices');
  const [searchLimit, setSearchLimit] = useState(6);
  const [searchResult, setSearchResult] = useState<any>(null);

  // YouTube State
  const [ytInput, setYtInput] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [ytLang, setYtLang] = useState('en');
  const [ytResult, setYtResult] = useState<any>(null);

  // GitHub State
  const [ghRepo, setGhRepo] = useState('pallets/flask');
  const [ghPath, setGhPath] = useState('README.md');
  const [ghBranch, setGhBranch] = useState('main');
  const [ghResult, setGhResult] = useState<any>(null);

  // RSS State
  const [rssUrl, setRssUrl] = useState('https://news.ycombinator.com/rss');
  const [rssResult, setRssResult] = useState<any>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeWeb = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webUrl, mode: webFallback }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to read web page');
      setWebResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const executeSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, limit: searchLimit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');
      setSearchResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const executeYoutube = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoIdOrUrl: ytInput, lang: ytLang, action: 'transcript' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get YouTube transcript');
      setYtResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const executeGithub = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: ghRepo, filePath: ghPath, branch: ghBranch, action: 'file' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to read GitHub file');
      setGhResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const executeRss = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/rss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rssUrl, limit: 8 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse RSS feed');
      setRssResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Playground Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => { setActiveTab('web'); setError(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'web'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Web Reader</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">web</span>
        </button>

        <button
          onClick={() => { setActiveTab('search'); setError(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'search'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Web Search</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">search</span>
        </button>

        <button
          onClick={() => { setActiveTab('youtube'); setError(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'youtube'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Youtube className="w-4 h-4" />
          <span>YouTube Subtitles</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">youtube</span>
        </button>

        <button
          onClick={() => { setActiveTab('github'); setError(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'github'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Github className="w-4 h-4" />
          <span>Public GitHub</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">github</span>
        </button>

        <button
          onClick={() => { setActiveTab('rss'); setError(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'rss'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Rss className="w-4 h-4" />
          <span>RSS & Atom</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">rss</span>
        </button>
      </div>

      {/* TAB 1: WEB READER */}
      {activeTab === 'web' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  Free Web Page Reader & Markdown Cleaner
                </h3>
                <p className="text-xs text-slate-400">
                  Strips ads, boilerplate, cookies banners, and converts to token-optimized Markdown.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Presets:</span>
                <button
                  onClick={() => setWebUrl('https://docs.python.org/3/whatsnew/3.13.html')}
                  className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Python 3.13
                </button>
                <button
                  onClick={() => setWebUrl('https://en.wikipedia.org/wiki/Open-source_software')}
                  className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Wikipedia
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={webUrl}
                onChange={(e) => setWebUrl(e.target.value)}
                placeholder="https://example.com/documentation"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <select
                value={webFallback}
                onChange={(e) => setWebFallback(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="auto">Route: Auto Fallback</option>
                <option value="direct">Route: Direct Scraper</option>
                <option value="jina">Route: Jina Reader (r.jina.ai)</option>
              </select>
              <button
                onClick={executeWeb}
                disabled={loading || !webUrl}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-semibold shadow transition disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{loading ? 'Reading...' : 'Fetch URL'}</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span>CLI Equivalent: <strong className="text-emerald-400">agent-reach web "{webUrl}" --json</strong></span>
              <button
                onClick={() => copyToClipboard(`agent-reach web "${webUrl}" --json`)}
                className="hover:text-white"
                title="Copy CLI command"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {webResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">{webResult.title || 'Page Title'}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Layers className="w-3 h-3" /> {webResult.provider}
                    </span>
                    <span>Chars: {webResult.characters?.toLocaleString()}</span>
                    <span>Tokens: ~{webResult.estimatedTokens}</span>
                    {webResult.truncated && (
                      <span className="text-amber-400 text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded">
                        Truncated to Token Limit
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenGeminiWithPrompt && (
                    <button
                      onClick={() =>
                        onOpenGeminiWithPrompt(
                          `Here is the content read from ${webResult.url}:\n\n${webResult.content.slice(0, 10000)}\n\nPlease summarize the key architectural points and code examples.`
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-medium transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze with Gemini</span>
                    </button>
                  )}
                  <button
                    onClick={() => copyToClipboard(webResult.content)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Markdown</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 max-h-96 overflow-y-auto text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                {webResult.content}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WEB SEARCH */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-cyan-400" />
                  Zero-Paid-API Web Search (DuckDuckGo + SearXNG)
                </h3>
                <p className="text-xs text-slate-400">
                  Search the live web without Google Cloud or Bing API billing. Returns structured JSON for coding agents.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Try:</span>
                <button
                  onClick={() => setSearchQuery('cursor .cursorrules best practices')}
                  className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cursor Rules
                </button>
                <button
                  onClick={() => setSearchQuery('claude code cli tools github')}
                  className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Claude Code
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search query..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              <select
                value={searchLimit}
                onChange={(e) => setSearchLimit(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value={4}>Limit: 4</option>
                <option value={8}>Limit: 8</option>
                <option value={15}>Limit: 15</option>
              </select>
              <button
                onClick={executeSearch}
                disabled={loading || !searchQuery}
                className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-lg text-xs font-semibold shadow transition disabled:opacity-50"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span>CLI Equivalent: <strong className="text-cyan-400">agent-reach search "{searchQuery}" --limit {searchLimit} --json</strong></span>
              <button
                onClick={() => copyToClipboard(`agent-reach search "${searchQuery}" --limit ${searchLimit} --json`)}
                className="hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {searchResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400">
                  Found <strong className="text-white">{searchResult.count}</strong> results via {searchResult.provider}
                </span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(searchResult, null, 2))}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Search JSON</span>
                </button>
              </div>

              <div className="space-y-3">
                {searchResult.results?.map((res: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={res.link || res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-cyan-400 hover:underline flex items-center gap-1.5"
                      >
                        <span>{res.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                      <button
                        onClick={() => {
                          setWebUrl(res.link || res.url);
                          setActiveTab('web');
                        }}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono bg-emerald-500/10 px-2 py-0.5 rounded"
                      >
                        Read with agent-reach
                      </button>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 truncate">{res.link || res.url}</div>
                    <p className="text-xs text-slate-300 leading-relaxed">{res.snippet}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: YOUTUBE */}
      {activeTab === 'youtube' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Youtube className="w-4 h-4 text-rose-400" />
                YouTube TimedText Subtitle Scraper
              </h3>
              <p className="text-xs text-slate-400">
                Extracts timed subtitles/transcripts directly from YouTube caption streams without YouTube Data API billing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={ytInput}
                onChange={(e) => setYtInput(e.target.value)}
                placeholder="Video URL (e.g. https://www.youtube.com/watch?v=... or Video ID)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
              />
              <select
                value={ytLang}
                onChange={(e) => setYtLang(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
              >
                <option value="en">Language: English (en)</option>
                <option value="zh">Language: Chinese (zh)</option>
                <option value="es">Language: Spanish (es)</option>
                <option value="ja">Language: Japanese (ja)</option>
              </select>
              <button
                onClick={executeYoutube}
                disabled={loading || !ytInput}
                className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 rounded-lg text-xs font-semibold shadow transition disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{loading ? 'Extracting...' : 'Get Subtitles'}</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span>CLI Equivalent: <strong className="text-rose-400">agent-reach youtube transcript "{ytInput}" --lang {ytLang} --json</strong></span>
              <button
                onClick={() => copyToClipboard(`agent-reach youtube transcript "${ytInput}" --lang ${ytLang} --json`)}
                className="hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {ytResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">{ytResult.title || `Video ${ytResult.videoId}`}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="text-rose-400">Provider: {ytResult.provider}</span>
                    <span>Total Lines: {ytResult.lineCount}</span>
                    <span>Lang: {ytResult.language}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenGeminiWithPrompt && (
                    <button
                      onClick={() =>
                        onOpenGeminiWithPrompt(
                          `Here is the video transcript for YouTube video ${ytResult.videoId}:\n\n${ytResult.fullTranscript.slice(0, 8000)}\n\nPlease summarize the key steps, advice, or code discussed in this video.`
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Summarize Video with Gemini</span>
                    </button>
                  )}
                  <button
                    onClick={() => copyToClipboard(ytResult.fullTranscript)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Full Transcript</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 max-h-80 overflow-y-auto space-y-2 text-xs">
                {ytResult.transcriptLines?.map((line: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 hover:bg-slate-900/60 p-1 rounded">
                    <span className="text-rose-400 font-mono text-[11px] shrink-0 bg-slate-900 px-1.5 py-0.5 rounded">
                      {line.start}
                    </span>
                    <span className="text-slate-200">{line.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: GITHUB */}
      {activeTab === 'github' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Github className="w-4 h-4 text-purple-400" />
                Public GitHub File & Repo Explorer
              </h3>
              <p className="text-xs text-slate-400">
                Reads public repository files directly via raw.githubusercontent.com with zero personal access token and no rate limiting.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Repository (owner/repo)</label>
                <input
                  type="text"
                  value={ghRepo}
                  onChange={(e) => setGhRepo(e.target.value)}
                  placeholder="e.g. facebook/react"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">File Path</label>
                <input
                  type="text"
                  value={ghPath}
                  onChange={(e) => setGhPath(e.target.value)}
                  placeholder="e.g. package.json or README.md"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Branch</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={ghBranch}
                    onChange={(e) => setGhBranch(e.target.value)}
                    placeholder="main"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <button
                    onClick={executeGithub}
                    disabled={loading || !ghRepo}
                    className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow transition disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{loading ? 'Fetching...' : 'Read'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span>CLI: <strong className="text-purple-400">agent-reach github file "{ghRepo}" "{ghPath}" --branch {ghBranch} --json</strong></span>
              <button
                onClick={() => copyToClipboard(`agent-reach github file "${ghRepo}" "${ghPath}" --branch ${ghBranch} --json`)}
                className="hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {ghResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-300 font-mono">
                  {ghResult.repo}/{ghResult.file} ({ghResult.branch}) - {ghResult.sizeBytes} bytes
                </span>
                <button
                  onClick={() => copyToClipboard(ghResult.content)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>

              <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 max-h-96 overflow-y-auto text-xs text-slate-200 font-mono leading-relaxed">
                {ghResult.content}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: RSS */}
      {activeTab === 'rss' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Rss className="w-4 h-4 text-amber-400" />
                RSS & Atom Feed Parser
              </h3>
              <p className="text-xs text-slate-400">
                Parse tech news, blog releases, and changelogs without third-party aggregator feeds.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={rssUrl}
                onChange={(e) => setRssUrl(e.target.value)}
                placeholder="https://feed.url/rss"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <button
                onClick={executeRss}
                disabled={loading || !rssUrl}
                className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded-lg text-xs font-semibold shadow transition disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{loading ? 'Parsing...' : 'Parse Feed'}</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span>CLI: <strong className="text-amber-400">agent-reach rss "{rssUrl}" --limit 10 --json</strong></span>
              <button
                onClick={() => copyToClipboard(`agent-reach rss "${rssUrl}" --limit 10 --json`)}
                className="hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {rssResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400">
                  {rssResult.type}: <strong className="text-white">{rssResult.itemCount}</strong> items parsed
                </span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(rssResult, null, 2))}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Feed JSON</span>
                </button>
              </div>

              <div className="space-y-3">
                {rssResult.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>{item.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                      {item.pubDate && (
                        <span className="text-[10px] text-slate-500 shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.pubDate}
                        </span>
                      )}
                    </div>
                    {item.summary && <p className="text-xs text-slate-300">{item.summary}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="font-semibold">Operation Failed</div>
            <div>{error}</div>
            <div className="text-[11px] text-rose-400/80">
              Tip: Run <strong className="font-mono">agent-reach doctor</strong> to verify route connectivity or check if platform cookies are needed.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
