import json
from typing import Dict, Any, Optional
from .web import fetch_raw

def read_github_file(repo: str, path: str = "README.md", branch: str = "main") -> Dict[str, Any]:
    """Reads raw GitHub file directly from raw.githubusercontent.com without token or rate limits."""
    owner, name = repo.split("/")
    raw_url = f"https://raw.githubusercontent.com/{owner}/{name}/{branch}/{path}"
    
    try:
        content = fetch_raw(raw_url)
    except Exception:
        # Try master branch if main fails
        if branch == "main":
            raw_url = f"https://raw.githubusercontent.com/{owner}/{name}/master/{path}"
            content = fetch_raw(raw_url)
            branch = "master"
        else:
            raise

    return {
        "repo": repo,
        "file": path,
        "branch": branch,
        "size_bytes": len(content),
        "content": content,
    }

def get_github_repo_info(repo: str) -> Dict[str, Any]:
    """Gets public repo info from api.github.com without requiring a token."""
    url = f"https://api.github.com/repos/{repo}"
    data_str = fetch_raw(url, headers={"User-Agent": "agent-reach/1.0"})
    data = json.loads(data_str)
    
    return {
        "repo": repo,
        "description": data.get("description"),
        "stars": data.get("stargazers_count"),
        "forks": data.get("forks_count"),
        "default_branch": data.get("default_branch"),
        "open_issues": data.get("open_issues_count"),
        "license": data.get("license", {}).get("name") if data.get("license") else None,
    }
