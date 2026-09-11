# Katto

Turn long videos, podcasts and Twitch VODs into scored, captioned **9:16 clips**
from any Pipedream workflow or AI agent, using the [Katto](https://katto.tech) API.

# Example Use Cases

- **Auto-clip new uploads**: when a YouTube/Twitch VOD is published, create a
  Katto clip job, then post the finished clips to TikTok, Reels and Shorts.
- **Podcast repurposing**: fetch a job's timestamped transcript and its scored
  clips to draft social captions with an LLM step.
- **Agent tool**: let a Pipedream AI agent clip a URL, poll the job and return the
  top clips on demand.

# Authentication

Create an API key at **https://katto.tech** -> Dashboard -> API keys (it starts
with `sk_live_`). Keys can be scoped **read-only** to reduce blast radius.

Supported sources: YouTube, Twitch, Vimeo, Rumble, Zoom and Dailymotion.

# Links

- Website: https://katto.tech
- API docs: https://katto.tech/docs/api
- Hosted MCP server: https://mcp.katto.tech
