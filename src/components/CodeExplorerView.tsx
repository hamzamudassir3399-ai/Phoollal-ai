import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  FolderTree, 
  Code2, 
  Layers 
} from 'lucide-react';
import { CLI_FILES, CliFile } from '../data/cliFiles';

export const CodeExplorerView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CliFile>(CLI_FILES[0]);
  const [copied, setCopied] = useState(false);

  const copyFileContent = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FolderTree className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">Open Source Architecture & Python Files</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pure Python implementation with zero required third-party APIs. Audit or customize any module.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/download/cli.py"
            download="agent_reach.py"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All-In-One Script</span>
          </a>
        </div>
      </div>

      {/* Main File Explorer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Sidebar: File Tree */}
        <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1 max-h-[600px] overflow-y-auto">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
            Project Tree
          </div>

          {CLI_FILES.map((file) => {
            const isSelected = selectedFile.name === file.name;
            return (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-slate-800 text-white font-medium border border-slate-700'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="truncate font-mono">{file.path}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Code Viewer */}
        <div className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <span>{selectedFile.path}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedFile.description}</p>
            </div>

            <button
              onClick={copyFileContent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono overflow-auto flex-1 max-h-[500px] leading-relaxed">
            {selectedFile.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
