"""
MCP (Model Context Protocol) Server for FreeAgentReach.
Exposes zero-cost internet tools to Claude Code, Cursor, and MCP clients.
"""

import sys
import json
from .web import read_web_page
from .search import search_web
from .youtube import get_youtube_transcript, search_youtube_videos
from .github import read_github_file
from .rss import parse_rss_feed
from .doctor import run_doctor_checks

TOOLS = [
    {
        "name": "web_read",
        "description": "Read any web page as clean Markdown without paid APIs. Handles JS-rendered sites via fallback.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "url": {"type": "string", "description": "The URL of the webpage to read"},
                "fallback": {"type": "string", "enum": ["auto", "direct", "jina"], "default": "auto"}
            },
            "required": ["url"]
        }
    },
    {
        "name": "web_search",
        "description": "Search the live web without paid APIs. Returns URLs, titles, and snippets.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "The search keywords or question"},
                "limit": {"type": "integer", "default": 8}
            },
            "required": ["query"]
        }
    },
    {
        "name": "youtube_transcript",
        "description": "Extract timestamped subtitles and transcripts from YouTube videos without Google API keys.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "video_url_or_id": {"type": "string", "description": "YouTube video ID or URL"},
                "lang": {"type": "string", "default": "en"}
            },
            "required": ["video_url_or_id"]
        }
    },
    {
        "name": "github_read_file",
        "description": "Read any public GitHub repo source file or README without auth tokens.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "repo": {"type": "string", "description": "owner/repo (e.g. vercel/next.js)"},
                "path": {"type": "string", "description": "File path (e.g. README.md or package.json)", "default": "README.md"},
                "branch": {"type": "string", "default": "main"}
            },
            "required": ["repo"]
        }
    },
    {
        "name": "rss_read",
        "description": "Parse RSS and Atom news feeds for the latest updates.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "feed_url": {"type": "string", "description": "URL of the RSS/Atom feed"},
                "limit": {"type": "integer", "default": 10}
            },
            "required": ["feed_url"]
        }
    },
    {
        "name": "doctor_check",
        "description": "Run diagnostic health check to verify internet reachability, fallback routes, and cookies.",
        "inputSchema": {
            "type": "object",
            "properties": {}
        }
    }
]

def handle_call_tool(name: str, arguments: dict):
    if name == "web_read":
        return read_web_page(arguments["url"], fallback_mode=arguments.get("fallback", "auto"))
    elif name == "web_search":
        return search_web(arguments["query"], limit=arguments.get("limit", 8))
    elif name == "youtube_transcript":
        return get_youtube_transcript(arguments["video_url_or_id"], lang=arguments.get("lang", "en"))
    elif name == "github_read_file":
        return read_github_file(arguments["repo"], path=arguments.get("path", "README.md"), branch=arguments.get("branch", "main"))
    elif name == "rss_read":
        return parse_rss_feed(arguments["feed_url"], limit=arguments.get("limit", 10))
    elif name == "doctor_check":
        return run_doctor_checks()
    else:
        raise ValueError(f"Unknown tool: {name}")

def run_mcp():
    """Stdio JSON-RPC loop for Model Context Protocol."""
    for line in sys.stdin:
        if not line.strip():
            continue
        try:
            req = json.loads(line)
            req_id = req.get("id")
            method = req.get("method")
            
            if method == "tools/list":
                res = {"jsonrpc": "2.0", "id": req_id, "result": {"tools": TOOLS}}
                print(json.dumps(res), flush=True)
            elif method == "tools/call":
                params = req.get("params", {})
                name = params.get("name")
                args = params.get("arguments", {})
                result = handle_call_tool(name, args)
                res = {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "content": [{"type": "text", "text": json.dumps(result, indent=2)}]
                    }
                }
                print(json.dumps(res), flush=True)
            elif method == "initialize":
                res = {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "protocolVersion": "2024-11-05",
                        "serverInfo": {"name": "agent-reach", "version": "1.0.0"},
                        "capabilities": {"tools": {}}
                    }
                }
                print(json.dumps(res), flush=True)
        except Exception as e:
            err_res = {"jsonrpc": "2.0", "id": req.get("id"), "error": {"code": -32603, "message": str(e)}}
            print(json.dumps(err_res), flush=True)

if __name__ == "__main__":
    run_mcp()
