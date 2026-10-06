import sys
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

def print_result(data: dict, as_json: bool, format_fn=None):
    if as_json:
        print(json.dumps(data, indent=2))
    elif format_fn:
        format_fn(data)
    else:
        print(json.dumps(data, indent=2))

def main():
    parser = argparse.ArgumentParser(
        prog="agent-reach",
        description="FreeAgentReach - Zero-API internet access for AI coding agents",
    )
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
    p_yt.add_argument("--limit", type=int, default=8)
    p_yt.add_argument("--json", action="store_true")

    # github
    p_gh = subparsers.add_parser("github", help="Read public GitHub repos")
    p_gh.add_argument("action", choices=["file", "info"])
    p_gh.add_argument("repo", help="owner/repo (e.g. facebook/react)")
    p_gh.add_argument("path", nargs="?", default="README.md")
    p_gh.add_argument("--branch", default="main")
    p_gh.add_argument("--json", action="store_true")

    # rss
    p_rss = subparsers.add_parser("rss", help="Parse RSS / Atom news feeds")
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
    p_mcp = subparsers.add_parser("mcp", help="Run MCP (Model Context Protocol) stdio server")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(0)

    try:
        if args.command == "web":
            res = read_web_page(args.url, fallback_mode=args.fallback, max_tokens=args.max_tokens)
            print_result(res, args.json, lambda d: print(f"=== {d['url']} ({d['provider']}) ===\n\n{d['content']}"))
        elif args.command == "search":
            res = search_web(args.query, limit=args.limit)
            def fmt_search(d):
                print(f"Results for '{d['query']}' ({d['count']} found via {d['provider']}):\n")
                for i, r in enumerate(d["results"], 1):
                    print(f"{i}. {r['title']}\n   URL:     {r['url']}\n   Snippet: {r['snippet']}\n")
            print_result(res, args.json, fmt_search)
        elif args.command == "youtube":
            if args.action == "transcript":
                res = get_youtube_transcript(args.query_or_video, lang=args.lang)
                print_result(res, args.json, lambda d: print(f"=== YouTube Transcript ({d['video_id']}, lang={d['language']}) ===\n\n{d['transcript']}"))
            else:
                res = search_youtube_videos(args.query_or_video, limit=args.limit)
                print_result(res, args.json)
        elif args.command == "github":
            if args.action == "file":
                res = read_github_file(args.repo, path=args.path, branch=args.branch)
                print_result(res, args.json, lambda d: print(f"=== {d['repo']}/{d['file']} ({d['branch']}) ===\n\n{d['content']}"))
            else:
                res = get_github_repo_info(args.repo)
                print_result(res, args.json)
        elif args.command == "rss":
            res = parse_rss_feed(args.url, limit=args.limit)
            def fmt_rss(d):
                print(f"=== RSS Feed: {d['feed_url']} ({d['count']} items) ===\n")
                for i, it in enumerate(d["items"], 1):
                    print(f"{i}. {it['title']}\n   Link:    {it['link']}\n   Summary: {it['summary']}\n")
            print_result(res, args.json, fmt_rss)
        elif args.command == "doctor":
            res = run_doctor_checks()
            def fmt_doc(d):
                print("FreeAgentReach Doctor Diagnostics:")
                print("=" * 60)
                for c in d["checks"]:
                    badge = "[ OK ]" if c["status"] == "OK" else "[WARN]"
                    print(f"{badge} {c['name']} ({c['category']})")
                    print(f"       Status: {c['details']}")
                    if c["fix"]:
                        print(f"       -> Fix: {c['fix']}")
                print("=" * 60)
                print(f"Overall status: {d['summary']['overall']} ({d['summary']['ok']}/{d['summary']['total']} healthy)")
            print_result(res, args.json, fmt_doc)
        elif args.command == "setup":
            guide = PLATFORM_GUIDES[args.platform]
            print(f"=== Setup Local Cookie: {guide['title']} ===")
            print(f"Route: {guide['free_route']}\n")
            print("Steps to copy cookie:")
            for s in guide["steps"]:
                print(f"  {s}")
            print("\nPrivacy: Stored locally in ~/.config/agent-reach/cookies.json (0600 permissions). Zero cloud telemetry.\n")
            val = input(f"Paste your cookie string or {guide['cookie_keys'][0]} value: ").strip()
            if val:
                set_cookie(args.platform, val)
                print(f"✅ Successfully stored local cookie for {args.platform}.")
            else:
                print("Cancelled. No changes made.")
        elif args.command == "mcp":
            run_mcp()
    except Exception as e:
        err = {"error": str(e)}
        if getattr(args, "json", False):
            print(json.dumps(err, indent=2))
        else:
            print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
