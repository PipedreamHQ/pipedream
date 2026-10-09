# SerpKite

[SerpKite](https://serpkite.com) provides structured Google search and news results and converts public webpages and PDFs to Markdown.

## Connecting an account

1. Create an account at [app.serpkite.com](https://app.serpkite.com).
2. Create an API key in the dashboard.
3. Connect SerpKite in Pipedream and enter the complete `skt_live_...` key in the **API Key** field.

Requests use `Authorization: Bearer <api_key>`. Keys are never included in URLs.

## Actions

- **Web Search**: Search Google with optional country, language, result count, and time window.
- **News Search**: Search Google News with the same localization and time controls.
- **Fetch Webpage**: Read a public HTML or PDF URL as Markdown.

All actions return the complete SerpKite response, including `meta`, so subsequent workflow steps can inspect request metadata. Search actions return organic items in `results`. Failed requests surface the API error through Pipedream and do not emit a success summary.

Search defaults to 10 results. Requests above 10 round up to whole pages and cost one credit per page fetched, capped at seven credits for 100 results. Empty and failed searches are not billed. Fetch Webpage costs one credit on success. See [API documentation](https://serpkite.com/docs) for current limits and billing behavior.

## App registration required

These components require a Pipedream app with slug `serpkite` and a secret authentication field named `api_key`. The connection test should call `GET https://api.serpkite.com/v1/account` with the Bearer header above; it does not perform a paid search. The app integration request linked in the pull request must be completed before these components can be published or connected.

## Local verification

Install the app dependency and run the isolated transport tests with Node.js 22.3 or later:

```sh
npm install --prefix components/serpkite --ignore-scripts --package-lock=false
node --experimental-test-module-mocks --test components/serpkite/test/actions.test.mjs
```

The tests mock Pipedream's HTTP transport. They verify request paths, authentication, localization, JSON POST bodies, complete response envelopes, empty results, and error propagation without calling the live API or consuming credits.
