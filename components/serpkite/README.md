# SerpKite

[SerpKite](https://serpkite.com) is a Google search API for AI agents and automations: structured Google results for every vertical, webpages and PDFs as Markdown, cited answers, site crawls, deep research, and the answers AI assistants (ChatGPT, Gemini, Copilot Search, Google AI Mode, Brave AI) give.

## Connecting an account

1. Create an account at [app.serpkite.com](https://app.serpkite.com).
2. Create an API key in the dashboard.
3. Connect SerpKite in Pipedream and enter the complete `skt_live_...` key in the **API Key** field.

Requests use `Authorization: Bearer <api_key>`. Keys are never included in URLs.

## Actions

Search (Google):

- **Web Search**: organic results, answer box, knowledge graph, People Also Ask and related searches; country, language, location, depth, page, time window, domain filters and an optional cited answer.
- **News Search**, **Image Search**, **Video Search**, **Shopping Search**, **Scholar Search**, **Patent Search**.
- **Get Autocomplete Suggestions**.
- **Maps Search** and **Get Place Details** (full listing by `place_id` or `cid` from a Maps result).

Pages and sites:

- **Fetch Webpage**: a public HTML page or PDF as Markdown.
- **Extract Pages**: up to 20 URLs as Markdown, with query-ranked highlights, AI summaries or JSON matching a schema.
- **Map Site**: a site's URLs from its sitemaps and start page.
- **Start Crawl** and **Get Crawl**: read a whole site or section asynchronously.

AI:

- **Answer Question**: a cited answer from live Google results.
- **Start Research** and **Get Research**: an asynchronous cited research report.
- **Ask ChatGPT**, **Ask Gemini**, **Ask Copilot Search**, **Ask Google AI Mode**, **Ask Brave AI**: the assistant's answer as a logged-out visitor, with the sources it cited and, with **Track**, `mentions` of your brands and domains.

All actions return the complete SerpKite response, including `meta`, so later steps can map any field. Failed requests surface the API error and do not emit a success summary. Failed, empty and refused requests are not billed; see [pricing](https://serpkite.com/pricing) for credits per call.

## Timeouts

Assistant answers take 1-10 s (Brave AI) to 5-45 s (the others), and the API gives up after 90 s, so the assistant actions wait up to 120 s. Pipedream's HTTP-triggered workflows stop after 30 s by default (cron-triggered after 60 s): raise **Settings → Execution Timeout Limit** to at least 120 seconds in workflows that ask ChatGPT, Gemini, Copilot Search or Google AI Mode. Crawls and research are asynchronous: start them, then read the result with the Get action (or pass a webhook URL).

## App registration required

These components require a Pipedream app with slug `serpkite` and a secret authentication field named `api_key`. The connection test should call `GET https://api.serpkite.com/v1/account` with the Bearer header above; it does not perform a paid search. The app integration request linked in the pull request must be completed before these components can be published or connected.

## Local verification

Install the app dependency and run the isolated transport tests with Node.js 22.3 or later:

```sh
npm install --prefix components/serpkite --ignore-scripts --package-lock=false
node --experimental-test-module-mocks --test components/serpkite/test/actions.test.mjs
```

The tests mock Pipedream's HTTP transport. They check every action's key and documentation link, request paths, methods, Bearer authentication, JSON bodies (camelCase props mapped to API fields, unset fields dropped), the assistants' 120 s timeout, input validation, summaries and error propagation, without calling the live API or consuming credits.
