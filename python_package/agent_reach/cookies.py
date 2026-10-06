import os
import json
from pathlib import Path
from typing import Dict, Optional

CONFIG_DIR = Path.home() / ".config" / "agent-reach"
COOKIES_FILE = CONFIG_DIR / "cookies.json"

def ensure_config_dir():
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    try:
        os.chmod(CONFIG_DIR, 0o700)
    except Exception:
        pass

def get_cookies() -> Dict[str, str]:
    if not COOKIES_FILE.exists():
        return {}
    try:
        with open(COOKIES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def set_cookie(platform: str, cookie_value: str):
    ensure_config_dir()
    data = get_cookies()
    data[platform.lower()] = cookie_value
    with open(COOKIES_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    try:
        os.chmod(COOKIES_FILE, 0o600)
    except Exception:
        pass

def remove_cookie(platform: str):
    data = get_cookies()
    if platform.lower() in data:
        del data[platform.lower()]
        ensure_config_dir()
        with open(COOKIES_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

def get_cookie(platform: str) -> Optional[str]:
    return get_cookies().get(platform.lower())
