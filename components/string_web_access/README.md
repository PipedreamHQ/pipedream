# Overview

The String Web Access API returns any page on the web as clean, LLM-ready Markdown, runs a
structured web search, and maps a site's URLs. Proxy rotation, anti-bot handling, CAPTCHA solving
and JavaScript rendering happen server-side, so a workflow step gets the page instead of a block
screen. Best for pages that rate-limit, geo-gate or refuse automated traffic — the ones where a
plain HTTP step returns a 403 and your workflow quietly stops.

# Example Use Cases

**Competitor price watch into a warehouse**

- Fetch a product page on a schedule, extract fields with a JSON schema, and append the result to
  Google Sheets, Postgres or BigQuery. No parser to maintain when the page changes shape.

**Research agent with live sources**

- Run Search Web on an incoming question, fetch the top results as Markdown, and pass them to
  OpenAI or Claude in the same workflow. The model reads pages, not block screens.

**Inbound lead enrichment**

- When a form submission arrives, fetch the company's site, pull the fields you need with a schema,
  and write them back to HubSpot or Salesforce before the sales rep opens the record.

# Getting Started

1. Create a free account at [portal.usestring.ai](https://portal.usestring.ai/sign-up). The first
   5,000 requests are free.
2. Open [Settings](https://portal.usestring.ai/settings) and copy an API key.
3. In Pipedream, connect the String Web Access account and paste the key. Pipedream sends it as a
   bearer token, so the key never appears in a step's code.

# Troubleshooting

**402 Payment Required** — the key is valid but the account balance can't cover the request. Top up
in the portal.

**A fetch returns a block page** — set **Render JavaScript** to true, or set a **Country Code** to
route through a proxy in the country the site serves. Failed requests are not billed.

**Map Site URLs costs more than expected** — the crawl is quoted before it runs and stops at the
**Budget (USD)** you set, so lower the budget or the page cap.
