import re
import sys
import json
import urllib.request
import urllib.parse
from typing import Dict, Any, Optional

BROWSER_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
)

def fetch_raw(url: str, headers: Optional[dict] = None, timeout: int = 10) -> str:
    req_headers = {
        "User-Agent": BROWSER_UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(url, headers=req_headers)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        charset = resp.headers.get_content_charset() or "utf-8"
        return resp.read().decode(charset, errors="replace")

def html_to_clean_markdown(html: str) -> str:
    """Zero-dependency HTML to clean structured Markdown converter."""
    cleaned = re.sub(r'<(script|style|svg|header|footer|nav|noscript|aside)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>', '', html, flags=re.I)
    
    # Structural headings
    cleaned = re.sub(r'<h1[^>]*>([\s\S]*?)<\/h1>', r'\n\n# \1\n\n', cleaned, flags=re.I)
    cleaned = re.sub(r'<h2[^>]*>([\s\S]*?)<\/h2>', r'\n\n## \1\n\n', cleaned, flags=re.I)
    cleaned = re.sub(r'<h3[^>]*>([\s\S]*?)<\/h3>', r'\n\n### \1\n\n', cleaned, flags=re.I)
    cleaned = re.sub(r'<h4[^>]*>([\s\S]*?)<\/h4>', r'\n\n#### \1\n\n', cleaned, flags=re.I)
    
    # Paragraphs and lists
    cleaned = re.sub(r'<p[^>]*>([\s\S]*?)<\/p>', r'\n\n\1\n\n', cleaned, flags=re.I)
    cleaned = re.sub(r'<li[^>]*>([\s\S]*?)<\/li>', r'\n* \1', cleaned, flags=re.I)
    
    # Code blocks and inline code
    cleaned = re.sub(r'<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>', r'\n```\n\1\n```\n', cleaned, flags=re.I)
    cleaned = re.sub(r'<code[^>]*>([\s\S]*?)<\/code>', r'`\1`', cleaned, flags=re.I)
    
    # Links
    cleaned = re.sub(r'<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>', r'[\2](\1)', cleaned, flags=re.I)
    
    # Strip remaining HTML tags
    cleaned = re.sub(r'<[^>]+>', ' ', cleaned)
    
    # Decode HTML entities
    cleaned = (
        cleaned.replace('&amp;', '&')
               .replace('&lt;', '<')
               .replace('&gt;', '>')
               .replace('&quot;', '"')
               .replace('&#39;', "'")
               .replace('&nbsp;', ' ')
    )
    
    # Clean whitespace
    lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in cleaned.split('\n')]
    result = '\n'.join(lines)
    return re.sub(r'\n{3,}', '\n\n', result).strip()

def read_web_page(url: str, fallback_mode: str = "auto", max_tokens: int = 5000) -> Dict[str, Any]:
    content = ""
    provider = "Direct HTML Reader"
    
    # Route 1: Direct fetch
    if fallback_mode != "jina":
        try:
            html = fetch_raw(url)
            content = html_to_clean_markdown(html)
        except Exception as e:
            # Automatic fallback to Jina Reader if direct fetch failed
            fallback_mode = "jina"
    
    # Route 2: Jina Reader free proxy
    if not content or fallback_mode == "jina":
        try:
            clean_url = re.sub(r'^https?://', 'https://', url)
            jina_url = f"https://r.jina.ai/{clean_url}"
            content = fetch_raw(jina_url, headers={"User-Agent": "agent-reach/1.0"})
            provider = "Jina Reader (r.jina.ai free route)"
        except Exception as e2:
            raise RuntimeError(f"Failed to read page via both direct and fallback routes: {e2}")

    max_chars = max_tokens * 4
    truncated = False
    if len(content) > max_chars:
        content = content[:max_chars] + "\n\n[... Truncated for AI context limit ...]"
        truncated = True

    return {
        "url": url,
        "provider": provider,
        "characters": len(content),
        "estimated_tokens": len(content) // 4,
        "truncated": truncated,
        "content": content,
    }
