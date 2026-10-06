# 🌐 FreeAgentReach (`agent-reach`)

> **Give your coding agent (Cursor, Claude Code, Cline, Aider) instant internet access without paid API keys.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Zero Paid API](https://img.shields.io/badge/Paid%20APIs-Zero%20$0-brightgreen.svg)]()
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Local%20Cookies-orange.svg)]()

---

## ⚡ 1-Command Install & Update

### Option A: Install via pip / uv
```bash
# Using pip
pip install -U agent-reach

# Or with uv tool (recommended)
uv tool install --upgrade agent-reach
```

### Option B: Standalone 1-liner (Zero Python dependencies)
```bash
curl -fsSL https://ais-dev-nq6mg2x4qiezoe5g3ygxr6-49371397759.asia-southeast1.run.app/install.sh | bash
```

---

## 🩺 Instant Health Check (`doctor`)

Run `agent-reach doctor` to test what works, what is blocked, and how to fix it:

```bash
agent-reach doctor
```

Output:
```text
FreeAgentReach Doctor Diagnostics:
============================================================
[ OK ] DuckDuckGo Search Route (Zero API key)
[ OK ] Jina Reader Markdown Fallback (r.jina.ai)
[ OK ] Public GitHub Raw & Rate Limits (60/60 remaining)
[ OK ] YouTube TimedText Subtitle Parser
[ OK ] Reddit Public JSON Route
[ OK ] Local Cookie Storage (~/.config/agent-reach/cookies.json)
[WARN] Xiaohongshu (Requires local cookie setup)
       -> Run 'agent-reach setup xiaohongshu'
============================================================
```

For AI agents to run and self-heal automatically:
```bash
agent-reach doctor --json
```

---

## 🚀 Built-in Zero-API Capabilities

| Command | Description | Fallback Route |
|---|---|---|
| `agent-reach web <url>` | Clean Markdown from any web page | Jina Reader `r.jina.ai` -> Archive.org |
| `agent-reach search "<query>"` | Real web search results with snippets | DuckDuckGo Lite -> SearXNG -> Jina |
| `agent-reach youtube transcript <id>` | Extract timed transcripts/subtitles | YouTube TimedText -> Invidious |
| `agent-reach github file <repo> <path>` | Read public repo files directly | `raw.githubusercontent.com` -> API |
| `agent-reach rss <feed_url>` | Parse RSS/Atom feeds cleanly | Native XML Parser |
| `agent-reach setup <platform>` | Interactive guide for local cookies | twitter, reddit, bilibili, xiaohongshu, linkedin |

---

## 🤖 Integration with Cursor & Claude Code

### Cursor (`.cursorrules` or `.cursor/rules/web-access.mdc`)
Add this to your project's `.cursorrules`:
```markdown
# Agent Internet Capability
When you need to look up documentation, read URLs, or search the web:
1. Run: \`agent-reach search "<query>" --json\` to find relevant URLs.
2. Run: \`agent-reach web "<url>" --json\` to read full documentation.
3. Run: \`agent-reach youtube transcript "<video_id>" --json\` for video guides.
4. Run: \`agent-reach github file "<owner/repo>" "<filepath>" --json\` to inspect open source code.
5. If something fails, run \`agent-reach doctor --json\` to inspect the diagnostic reason.
Always pass \`--json\` so you can parse outputs deterministically.
```

### Claude Code (`CLAUDE.md`)
Add this to your `CLAUDE.md`:
```markdown
## Web Access Tools
You have access to the \`agent-reach\` CLI for zero-cost web browsing:
- Web Search: \`agent-reach search "query" --json\`
- Web Page Reading: \`agent-reach web "https://url" --json\`
- GitHub Code: \`agent-reach github file "owner/repo" "path/to/file" --json\`
- Diagnostics: \`agent-reach doctor --json\`
```

### MCP (Model Context Protocol) Server
Run the built-in MCP server:
```json
{
  "mcpServers": {
    "agent-reach": {
      "command": "agent-reach",
      "args": ["mcp"]
    }
  }
}
```

---

## 🔒 Privacy & Local Cookies
- **Zero Cloud Telemetry**: Cookies and session strings are stored **only** on your local filesystem under `~/.config/agent-reach/cookies.json`.
- File permissions are locked to `0600` (readable only by your OS user).
- Cookies are only sent to the corresponding platform's official domains.
