export interface CliFile {
  name: string;
  path: string;
  description: string;
  content: string;
}

export const CLI_FILES: CliFile[] = [
  {
    name: "cli.py",
    path: "agent_reach/cli.py",
    description: "Main CLI entry point with subcommands: web, search, youtube, github, rss, doctor, setup, mcp",
    content: `import sys
import json
import argparse
from .web import read_web_page
from .search import search_web
from .youtube import get_youtube_transcript, search_youtube_videos
from .github import read_github_file, get_github_repo_info
from .rss import parse_rss_feed
from .doctor import run_doctor_checks
from .cookies import set_cookie, get_cookies
from .platforms import PLATFORM_GUIDES
from .mcp_server import run_mcp

def main():
    parser = argparse.ArgumentParser(prog="agent-reach", description="FreeAgentReach - Zero-API internet access for AI coding agents")
    parser.add_argument("--version", action="version", version="agent-reach 1.0.0")
    subparsers = parser.add_subparsers(dest="command")

    # web
    p_web = subparsers.add_parser("web", help="Read web page as clean Markdown")
    p_web.add_argument("url", help="Target URL")
    p_web.add_argument("--fallback", choices=["auto", "direct", "jina"], default="auto")
    p_web.add_argument("--max-tokens", type=int, default=5000)
    p_web.add_argument("--json", action="store_true")

    # search
    p_search = subparsers.add_parser("search", help="Search the web freely")
    p_search.add_argument("query", help="Search keywords")
    p_search.add_argument("--limit", type=int, default=8)
    p_search.add_argument("--json", action="store_true")

    # youtube
    p_yt = subparsers.add_parser("youtube", help="YouTube transcript extraction")
    p_yt.add_argument("action", choices=["transcript", "search"])
    p_yt.add_argument("query_or_video", help="Video ID/URL or search query")
    p_yt.add_argument("--lang", default="en")
    p_yt.add_argument("--json", action="store_true")

    # github
    p_gh = subparsers.add_parser("github", help="Read public GitHub repos")
    p_gh.add_argument("action", choices=["file", "info"])
    p_gh.add_argument("repo", help="owner/repo")
    p_gh.add_argument("path", nargs="?", default="README.md")
    p_gh.add_argument("--branch", default="main")
    p_gh.add_argument("--json", action="store_true")

    # rss
    p_rss = subparsers.add_parser("rss", help="Parse RSS / Atom feeds")
    p_rss.add_argument("url", help="Feed URL")
    p_rss.add_argument("--limit", type=int, default=10)
    p_rss.add_argument("--json", action="store_true")

    # doctor
    p_doc = subparsers.add_parser("doctor", help="Run diagnostic health checks")
    p_doc.add_argument("--json", action="store_true")

    # setup
    p_set = subparsers.add_parser("setup", help="Configure platform cookies locally")
    p_set.add_argument("platform", choices=["twitter", "reddit", "bilibili", "xiaohongshu", "linkedin"])

    # mcp
    p_mcp = subparsers.add_parser("mcp", help="Run MCP stdio server")

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        sys.exit(0)

    # Dispatch logic...
if __name__ == "__main__":
    main()`,
  },
  {
    name: "web.py",
    path: "agent_reach/web.py",
    description: "Read any web page without API keys. Direct HTML cleaner + Jina Reader r.jina.ai fallback route",
    content: `import re
import urllib.request
from typing import Dict, Any

def html_to_clean_markdown(html: str) -> str:
    cleaned = re.sub(r'<(script|style|svg|header|footer|nav)\\b[^<]*(?:(?!<\\/\\1>)<[^<]*)*<\\/\\1>', '', html, flags=re.I)
    cleaned = re.sub(r'<h1[^>]*>([\\s\\S]*?)<\\/h1>', r'\\n\\n# \\1\\n\\n', cleaned, flags=re.I)
    cleaned = re.sub(r'<h2[^>]*>([\\s\\S]*?)<\\/h2>', r'\\n\\n## \\1\\n\\n', cleaned, flags=re.I)
    cleaned = re.sub(r'<p[^>]*>([\\s\\S]*?)<\\/p>', r'\\n\\n\\1\\n\\n', cleaned, flags=re.I)
    cleaned = re.sub(r'<li[^>]*>([\\s\\S]*?)<\\/li>', r'\\n* \\1', cleaned, flags=re.I)
    cleaned = re.sub(r'<[^>]+>', ' ', cleaned)
    return re.sub(r'\\n{3,}', '\\n\\n', cleaned).strip()

def read_web_page(url: str, fallback_mode: str = "auto", max_tokens: int = 5000) -> Dict[str, Any]:
    # Route 1: Direct Fetch
    # Route 2: Free Jina Reader proxy fallback (r.jina.ai)
    pass`,
  },
  {
    name: "search.py",
    path: "agent_reach/search.py",
    description: "Zero-cost web search using DuckDuckGo HTML Lite and SearXNG fallback instances",
    content: `import re
import urllib.parse
from typing import Dict, Any, List
from .web import fetch_raw

def search_web(query: str, limit: int = 8) -> Dict[str, Any]:
    encoded = urllib.parse.quote_plus(query)
    url = f"https://html.duckduckgo.com/html/?q={encoded}"
    html = fetch_raw(url)
    # Extracts title, url, snippet from HTML
    # Returns structured JSON for coding agents
    pass`,
  },
  {
    name: "youtube.py",
    path: "agent_reach/youtube.py",
    description: "Extract timed subtitles/transcripts from YouTube videos without Google API keys",
    content: `import re
import json
import xml.etree.ElementTree as ET

def get_youtube_transcript(url_or_id: str, lang: str = "en") -> dict:
    # 1. Fetch YouTube watch page HTML
    # 2. Extract captionTracks baseUrl
    # 3. Parse XML timedtext into [MM:SS] lines
    # 4. Fallback to Invidious timedtext instance if blocked
    pass`,
  },
  {
    name: "doctor.py",
    path: "agent_reach/doctor.py",
    description: "Doctor diagnostic health check: tests routes, local storage permissions, and recommends fixes",
    content: `def run_doctor_checks() -> dict:
    # Checks: DuckDuckGo, Jina Reader, GitHub raw, YouTube subtitles, Reddit JSON, Local Cookies
    # Output: Status badges + Actionable fix recommendations
    pass`,
  },
  {
    name: "mcp_server.py",
    path: "agent_reach/mcp_server.py",
    description: "Standard Model Context Protocol (MCP) server for Claude Code and Cursor",
    content: `"""Standard MCP Stdio JSON-RPC Server"""
# Tools: web_read, web_search, youtube_transcript, github_read_file, rss_read, doctor_check
`,
  },
  {
    name: "pyproject.toml",
    path: "pyproject.toml",
    description: "Python package configuration for pip and uv tool installs",
    content: `[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "agent-reach"
version = "1.0.0"
requires-python = ">=3.8"
dependencies = [
    "httpx>=0.24.0",
    "beautifulsoup4>=4.12.0",
]`,
  },
];
