# Pipedream GitDealFlow Components

Pipedream component package for [VC Deal Flow Signal](https://gitdealflow.com) — trending startup engineering signals across 20 sectors. No auth required.

## Actions

- `gitdealflow-get-trending-startups` — top startups this period
- `gitdealflow-find-startup` — single-startup lookup by name or slug
- `gitdealflow-search-by-sector` — every tracked startup in a sector
- `gitdealflow-get-engineering-signals` — startups with deploy/infra/framework/hiring signals (filter optional)

## Sources

- `gitdealflow-new-trending-startup` — emits when a startup enters the top 20 (polls daily, dedupes by `period+name`)
- `gitdealflow-new-engineering-signal` — emits when a startup gets a new signal type (polls daily, dedupes by `period+name+signal`)

## Example workflows

1. **Slack `#deal-flow` weekly drop** — Source `New Trending Startup` → Slack `Send Channel Message`.
2. **Notion deal board** — Source `New Engineering Signal` → Notion `Create Database Page` with stage / sector / commit-velocity / link.
3. **HubSpot lead enrichment** — Trigger on lead create → Action `Find Startup by Name` → patch HubSpot company with engineering metrics.
4. **Google Sheets watchlist** — Source `New Trending Startup` → Sheets `Append Row`.

## License

MIT — free with attribution. Cite as `VC Deal Flow Signal (signals.gitdealflow.com)`.

## Contact

signal@gitdealflow.com — issues at github.com/kindrat86/vc-deal-flow-signal
