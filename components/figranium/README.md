# Overview

[Figranium](https://figranium.com) is a self-hosted browser automation and web scraping platform. With the Figranium API, you can build workflows that:

- Trigger and manage automation tasks (scrape, agent, and headful modes)
- Inspect execution history and results
- Configure and monitor task schedules

# Getting Started

To connect, provide your Figranium server's **Base URL** and an **API Key** from Figranium's Settings page.

Because Pipedream workflows run in Pipedream's cloud, the Base URL must be reachable from the public internet — a `localhost` or private-network address won't work. If you're running Figranium locally, expose it with a tunnel (e.g. Cloudflare Tunnel, ngrok, Tailscale Funnel) or deploy it to a public host with a real domain and HTTPS, then use that public URL (e.g. `https://figranium.example.com`) as the Base URL.
