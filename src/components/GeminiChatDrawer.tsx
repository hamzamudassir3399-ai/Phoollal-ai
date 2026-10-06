import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  BrainCircuit, 
  RefreshCw, 
  X, 
  Trash2, 
  Zap, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  thinkingEnabled?: boolean;
}

interface GeminiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const GeminiChatDrawer: React.FC<GeminiChatDrawerProps> = ({
  isOpen,
  onClose,
  initialPrompt = '',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '👋 Hello! I am your FreeAgentReach AI Assistant powered by Gemini. Ask me how to give Cursor or Claude Code internet access, debug scraper fallbacks, test local cookies, or diagnose issues with `agent-reach doctor`.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [systemRole, setSystemRole] = useState<'agent_assistant' | 'doctor_diagnostician' | 'content_summarizer'>('agent_assistant');
  const [enableThinking, setEnableThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      setInput(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          model: enableThinking ? 'gemini-3.1-pro-preview' : model,
          systemRole,
          enableThinking,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Done.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        thinkingEnabled: data.thinkingEnabled,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ Error: ${err.message}. Please check your connection or try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    'How do I configure Cursor to use agent-reach without memorizing flags?',
    'What fallback routes are used when DuckDuckGo blocks requests?',
    'How does local cookie storage guarantee zero cloud leakage?',
    'How can Claude Code invoke agent-reach as an MCP tool?',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] z-50 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Gemini Intelligence Chat</h3>
              {enableThinking && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono flex items-center gap-1 border border-indigo-500/30">
                  <BrainCircuit className="w-3 h-3 text-indigo-400" />
                  HIGH THINKING
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Agent Internet & Scraper Copilot</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMessages([messages[0]])}
            title="Clear Chat History"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Role & Model Controls */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800/80 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* Role selector */}
          <select
            value={systemRole}
            onChange={(e: any) => setSystemRole(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500 flex-1"
          >
            <option value="agent_assistant">Role: Coding Agent Assistant</option>
            <option value="doctor_diagnostician">Role: Doctor Diagnostician</option>
            <option value="content_summarizer">Role: Content Summarizer</option>
          </select>

          {/* Model selector */}
          <select
            value={enableThinking ? 'gemini-3.1-pro-preview' : model}
            disabled={enableThinking}
            onChange={(e: any) => setModel(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
          >
            <option value="gemini-3.5-flash">Gemini 3.5 Flash (General)</option>
            <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Fast)</option>
            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview (Complex)</option>
          </select>
        </div>

        {/* High Thinking Toggle */}
        <div className="flex items-center justify-between bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800/60">
          <div className="flex items-center gap-1.5">
            <BrainCircuit className={`w-3.5 h-3.5 ${enableThinking ? 'text-indigo-400' : 'text-slate-500'}`} />
            <span className="text-[11px] text-slate-300 font-medium">Deep Reasoning (High Thinking)</span>
          </div>
          <button
            onClick={() => setEnableThinking(!enableThinking)}
            className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
              enableThinking ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                enableThinking ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Messages Thread (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 text-xs ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3.5 space-y-1.5 shadow-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1 text-[10px] text-slate-400">
                <span className="font-semibold">{m.role === 'user' ? 'You' : 'Gemini AI'}</span>
                <div className="flex items-center gap-1.5">
                  <span>{m.timestamp}</span>
                  {m.role === 'assistant' && (
                    <button
                      onClick={() => copyMessage(m.content, m.id)}
                      className="hover:text-white"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="whitespace-pre-wrap font-sans text-xs">{m.content}</div>

              {m.thinkingEnabled && (
                <div className="pt-1 text-[10px] text-indigo-400 font-mono flex items-center gap-1">
                  <BrainCircuit className="w-3 h-3" /> Processed via Gemini 3.1 Pro High Thinking
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 text-xs items-center text-slate-400">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-slate-300 text-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>
                {enableThinking ? 'Thinking deeply with Gemini 3.1 Pro...' : 'Analyzing and formulating response...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-slate-950/40 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            enableThinking
              ? 'Ask a complex reasoning query (High Thinking active)...'
              : 'Ask Gemini about agent internet tools, scraper fixes...'
          }
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
