import json
import re
from typing import Dict, Any, Optional
from .web import fetch_raw
from .cookies import get_cookie

PLATFORM_GUIDES = {
    "twitter": {
        "title": "Twitter / X (Public Syndication & Auth Cookies)",
        "free_route": "Public tweets can be read without login via Twitter's syndication CDN endpoint.",
        "steps": [
            "1. Open https://x.com in Google Chrome or Firefox and log into your account.",
            "2. Press F12 (or right-click -> Inspect) to open Chrome DevTools.",
            "3. Click the 'Application' tab (in Firefox: 'Storage').",
            "4. Expand 'Cookies' in the left sidebar and click 'https://x.com'.",
            "5. Locate 'auth_token' and 'ct0' cookies and copy their values.",
            "6. Run: `agent-reach setup twitter` and paste the cookie string.",
        ],
        "cookie_keys": ["auth_token", "ct0"],
    },
    "reddit": {
        "title": "Reddit (Public JSON Endpoints & Session Cookie)",
        "free_route": "Reddit allows reading public subreddits by appending `.json` to any URL (e.g. `https://www.reddit.com/r/python.json`).",
        "steps": [
            "1. Open https://reddit.com in your browser.",
            "2. Press F12 -> Application -> Storage -> Cookies -> https://www.reddit.com.",
            "3. Copy the 'reddit_session' cookie value.",
            "4. Run: `agent-reach setup reddit` to store locally for private/NSFW subreddits.",
        ],
        "cookie_keys": ["reddit_session"],
    },
    "bilibili": {
        "title": "Bilibili (Video Subtitles, Dynamic Feeds & SESSDATA)",
        "free_route": "Public video metadata and basic player info work without login via `api.bilibili.com/x/web-interface/view`.",
        "steps": [
            "1. Open https://bilibili.com in your browser and log in.",
            "2. Press F12 -> Application -> Cookies -> https://bilibili.com.",
            "3. Copy 'SESSDATA' and 'bili_jct'.",
            "4. Run: `agent-reach setup bilibili` to unlock high-res streams and member comments.",
        ],
        "cookie_keys": ["SESSDATA", "bili_jct"],
    },
    "xiaohongshu": {
        "title": "Xiaohongshu / RED (Anti-Bot Slider Session)",
        "free_route": "Xiaohongshu requires cookies for almost all web browsing to pass slider verification.",
        "steps": [
            "1. Open https://xiaohongshu.com in your browser and log in with phone/SMS.",
            "2. Press F12 -> Application -> Cookies -> https://xiaohongshu.com.",
            "3. Copy 'a1' and 'web_session' cookie values.",
            "4. Run: `agent-reach setup xiaohongshu` to save cookies into local storage.",
        ],
        "cookie_keys": ["a1", "web_session"],
    },
    "linkedin": {
        "title": "LinkedIn (Member Posts & li_at Session)",
        "free_route": "Public company articles can be read via web search; profile reading requires member auth.",
        "steps": [
            "1. Open https://linkedin.com and log into your account.",
            "2. Press F12 -> Application -> Cookies -> https://www.linkedin.com.",
            "3. Copy the 'li_at' cookie value.",
            "4. Run: `agent-reach setup linkedin` to store your local session cookie.",
        ],
        "cookie_keys": ["li_at"],
    },
}

def fetch_reddit_post(subreddit: str, limit: int = 5) -> Dict[str, Any]:
    url = f"https://www.reddit.com/r/{subreddit}.json?limit={limit}"
    cookie = get_cookie("reddit")
    headers = {"User-Agent": "free-agent-reach:1.0 (by coding agent)"}
    if cookie:
        headers["Cookie"] = f"reddit_session={cookie}"
    data_str = fetch_raw(url, headers=headers)
    data = json.loads(data_str)
    
    posts = []
    for child in data.get("data", {}).get("children", []):
        d = child.get("data", {})
        posts.append({
            "title": d.get("title"),
            "author": d.get("author"),
            "score": d.get("score"),
            "url": f"https://reddit.com{d.get('permalink')}",
            "selftext": d.get("selftext", "")[:300],
        })
    return {"subreddit": subreddit, "count": len(posts), "posts": posts}

def fetch_twitter_tweet_guest(tweet_id: str) -> Dict[str, Any]:
    """Uses Twitter syndication endpoint without requiring login."""
    url = f"https://cdn.syndication.twimg.com/tweet-result?id={tweet_id}&token=x"
    cookie = get_cookie("twitter")
    headers = {"User-Agent": "agent-reach/1.0"}
    if cookie:
        headers["Cookie"] = cookie
    try:
        data_str = fetch_raw(url, headers=headers)
        data = json.loads(data_str)
        return {
            "tweet_id": tweet_id,
            "text": data.get("text"),
            "user": data.get("user", {}).get("name"),
            "screen_name": data.get("user", {}).get("screen_name"),
            "created_at": data.get("created_at"),
        }
    except Exception as e:
        return {"error": f"Failed to fetch tweet: {e}. Check if tweet is deleted or private."}
