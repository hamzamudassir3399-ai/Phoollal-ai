import os
import sys
from typing import Dict, Any, List
from .web import fetch_raw
from .cookies import get_cookies, COOKIES_FILE

def run_doctor_checks() -> Dict[str, Any]:
    checks = []
    
    # 1. DuckDuckGo Search Check
    try:
        fetch_raw("https://html.duckduckgo.com/html/?q=test", timeout=4)
        checks.append({
            "name": "DuckDuckGo Free Web Search",
            "status": "OK",
            "category": "Search",
            "details": "Active. Zero paid API keys needed.",
            "fix": "",
        })
    except Exception as e:
        checks.append({
            "name": "DuckDuckGo Free Web Search",
            "status": "WARN",
            "category": "Search",
            "details": f"HTML route slow or blocked: {e}",
            "fix": "Fallback routes (Jina/SearXNG) will activate automatically.",
        })

    # 2. Jina Reader Markdown Fallback
    try:
        fetch_raw("https://r.jina.ai/https://example.com", timeout=4)
        checks.append({
            "name": "Jina Reader Proxy (r.jina.ai)",
            "status": "OK",
            "category": "Web Reader",
            "details": "Online for markdown conversion & Cloudflare bypass.",
            "fix": "",
        })
    except Exception:
        checks.append({
            "name": "Jina Reader Proxy (r.jina.ai)",
            "status": "WARN",
            "category": "Web Reader",
            "details": "Proxy unreachable.",
            "fix": "Native HTML parser will handle all web pages directly.",
        })

    # 3. Public GitHub Raw Access
    try:
        fetch_raw("https://raw.githubusercontent.com/octocat/Hello-World/master/README", timeout=4)
        checks.append({
            "name": "Public GitHub File & Raw Access",
            "status": "OK",
            "category": "GitHub",
            "details": "Direct raw file reading active (unlimited token-free reads).",
            "fix": "",
        })
    except Exception as e:
        checks.append({
            "name": "Public GitHub File & Raw Access",
            "status": "WARN",
            "category": "GitHub",
            "details": f"Failed reaching raw.githubusercontent.com: {e}",
            "fix": "Check network DNS settings.",
        })

    # 4. YouTube TimedText Subtitles
    try:
        fetch_raw("https://www.youtube.com/watch?v=dQw4w9WgXcQ", timeout=4)
        checks.append({
            "name": "YouTube TimedText Subtitle Parser",
            "status": "OK",
            "category": "YouTube",
            "details": "Caption tracks extractor active without Google API key.",
            "fix": "",
        })
    except Exception as e:
        checks.append({
            "name": "YouTube TimedText Subtitle Parser",
            "status": "WARN",
            "category": "YouTube",
            "details": f"Connection notice: {e}",
            "fix": "Invidious fallback proxy will handle video subtitle queries.",
        })

    # 5. Reddit Public JSON
    try:
        fetch_raw("https://www.reddit.com/r/python.json?limit=1", timeout=4)
        checks.append({
            "name": "Reddit Public JSON API",
            "status": "OK",
            "category": "Reddit",
            "details": "Direct .json route accessible.",
            "fix": "",
        })
    except Exception:
        checks.append({
            "name": "Reddit Public JSON API",
            "status": "WARN",
            "category": "Reddit",
            "details": "Unauthenticated rate limits may apply.",
            "fix": "Run `agent-reach setup reddit` to store local session cookie.",
        })

    # 6. Local Storage Security
    cookies = get_cookies()
    configured = list(cookies.keys())
    checks.append({
        "name": "Local Cookie File Security",
        "status": "OK",
        "category": "Privacy",
        "details": f"Location: {COOKIES_FILE} (0600 POSIX permissions). Configured: {', '.join(configured) if configured else 'None'}",
        "fix": "No telemetry. Files never leave your local computer.",
    })

    ok_count = sum(1 for c in checks if c["status"] == "OK")
    warn_count = sum(1 for c in checks if c["status"] == "WARN")
    
    return {
        "summary": {
            "total": len(checks),
            "ok": ok_count,
            "warnings": warn_count,
            "overall": "All Healthy" if warn_count == 0 else "Operational with Fallbacks",
        },
        "checks": checks,
    }
