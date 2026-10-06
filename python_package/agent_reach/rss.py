import re
import xml.etree.ElementTree as ET
from typing import Dict, Any, List
from .web import fetch_raw

def parse_rss_feed(url: str, limit: int = 10) -> Dict[str, Any]:
    xml_data = fetch_raw(url, headers={"User-Agent": "agent-reach/1.0 RSS Reader"})
    root = ET.fromstring(xml_data)
    
    is_atom = root.tag.endswith("feed")
    items: List[Dict[str, str]] = []
    
    if is_atom:
        for entry in root.findall("{http://www.w3.org/2005/Atom}entry")[:limit]:
            title = entry.findtext("{http://www.w3.org/2005/Atom}title") or "Untitled"
            link_el = entry.find("{http://www.w3.org/2005/Atom}link")
            link = link_el.get("href") if link_el is not None else ""
            summary = entry.findtext("{http://www.w3.org/2005/Atom}summary") or entry.findtext("{http://www.w3.org/2005/Atom}content") or ""
            items.append({
                "title": title.strip(),
                "link": link.strip(),
                "summary": re.sub(r'<[^>]+>', '', summary).strip()[:300],
            })
    else:
        for item in root.findall(".//item")[:limit]:
            title = item.findtext("title") or "Untitled"
            link = item.findtext("link") or ""
            desc = item.findtext("description") or ""
            pub_date = item.findtext("pubDate") or ""
            items.append({
                "title": title.strip(),
                "link": link.strip(),
                "published": pub_date.strip(),
                "summary": re.sub(r'<[^>]+>', '', desc).strip()[:300],
            })
            
    return {
        "feed_url": url,
        "type": "Atom" if is_atom else "RSS 2.0",
        "count": len(items),
        "items": items,
    }
