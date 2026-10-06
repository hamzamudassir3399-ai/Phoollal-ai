import re
import json
import xml.etree.ElementTree as ET
from typing import Dict, Any, List
from .web import fetch_raw

def extract_video_id(url_or_id: str) -> str:
    if "youtube.com/watch?v=" in url_or_id:
        return url_or_id.split("v=")[1].split("&")[0]
    elif "youtu.be/" in url_or_id:
        return url_or_id.split("youtu.be/")[1].split("?")[0]
    return url_or_id

def get_youtube_transcript(url_or_id: str, lang: str = "en") -> Dict[str, Any]:
    vid = extract_video_id(url_or_id)
    page_html = fetch_raw(f"https://www.youtube.com/watch?v={vid}")
    
    caption_match = re.search(r'"captionTracks":(\[.*?\])', page_html)
    if not caption_match:
        raise ValueError(f"No caption tracks available on YouTube for video {vid}. Captions may be disabled.")
    
    tracks = json.loads(caption_match.group(1))
    track = next((t for t in tracks if t.get("languageCode") == lang or lang in t.get("vssId", "")), tracks[0])
    
    xml_data = fetch_raw(track["baseUrl"])
    root = ET.fromstring(xml_data)
    lines = []
    
    for child in root.findall("text"):
        start = float(child.get("start", "0"))
        mins = int(start // 60)
        secs = int(start % 60)
        raw_text = (child.text or "").strip()
        decoded_text = (
            raw_text.replace("&amp;", "&")
                    .replace("&quot;", '"')
                    .replace("&#39;", "'")
                    .replace("&lt;", "<")
                    .replace("&gt;", ">")
        )
        if decoded_text:
            lines.append(f"[{mins:02d}:{secs:02d}] {decoded_text}")
    
    return {
        "video_id": vid,
        "language": track.get("languageCode", lang),
        "lines_count": len(lines),
        "transcript": "\n".join(lines),
    }

def search_youtube_videos(query: str, limit: int = 8) -> Dict[str, Any]:
    encoded = query.replace(" ", "+")
    page_html = fetch_raw(f"https://www.youtube.com/results?search_query={encoded}")
    
    video_ids = []
    for match in re.finditer(r'"videoId":"([a-zA-Z0-9_-]{11})"', page_html):
        vid = match.group(1)
        if vid not in video_ids:
            video_ids.append(vid)
        if len(video_ids) >= limit:
            break
            
    results = [
        {
            "video_id": vid,
            "url": f"https://www.youtube.com/watch?v={vid}",
            "transcript_command": f"agent-reach youtube transcript {vid}",
        }
        for vid in video_ids
    ]
    
    return {
        "query": query,
        "provider": "YouTube HTML Scraper (Zero API Key)",
        "count": len(results),
        "results": results,
    }
