# Pipedream GitDealFlow Components

Pipedream component package for [VC Deal Flow Signal](https://gitdealflow.com) — trending startup engineering signals across 20 sectors. No auth required.

## Actions

- `vc_deal_flow_signal-get-trending-startups` — top startups this period
- `vc_deal_flow_signal-find-startup` — single-startup lookup by name or slug
- `vc_deal_flow_signal-search-by-sector` — every tracked startup in a sector
- `vc_deal_flow_signal-get-engineering-signals` — startups with deploy/infra/framework/hiring signals (filter optional)

## Sources

- `vc_deal_flow_signal-new-trending-startup` — emits when a startup enters the top 20 (polls daily, dedupes by `period+name`)
- `vc_deal_flow_signal-new-engineering-signal` — emits when a startup gets a new signal type (polls daily, dedupes by `period+name+signal`)

## Example workflows

1. **Slack `#deal-flow` weekly drop** — Source `New Trending Startup` → Slack `Send Channel Message`.
2. **Notion deal board** — Source `New Engineering Signal` → Notion `Create Database Page` with stage / sector / commit-velocity / link.
3. **HubSpot lead enrichment** — Trigger on lead create → Action `Find Startup by Name` → patch HubSpot company with engineering metrics.
4. **Google Sheets watchlist** — Source `New Trending Startup` → Sheets `Append Row`.
