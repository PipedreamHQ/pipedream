# Overview

The String Web Access API returns any page on the web as clean, LLM-ready Markdown, runs a
structured web search, and maps a site's URLs.

# Example Use Cases

**Competitor price watch into a warehouse**

- Fetch a product page on a schedule, extract fields with a JSON schema, and append the result to
  Google Sheets, Postgres or BigQuery. No parser to maintain when the page changes shape.

**Research agent with live sources**

- Run Search Web on an incoming question, fetch the top results as Markdown, and pass them to
  OpenAI or Claude in the same workflow. The model reads the page text, not raw HTML.

**Inbound lead enrichment**

- When a form submission arrives, fetch the company's site, pull the fields you need with a schema,
  and write them back to HubSpot or Salesforce before the sales rep opens the record.

# Getting Started

1. Create a free account at [portal.usestring.ai](https://portal.usestring.ai/sign-up). The first
   5,000 standard requests are free.
2. Open [Settings](https://portal.usestring.ai/settings) and copy an API key.
3. In Pipedream, connect the String Web Access account and paste the key. Pipedream sends it as a
   bearer token, so the key never appears in a step's code.

# Troubleshooting

**402 Payment Required** — the key is valid but the account balance can't cover the request. Top up
in the portal.

**A fetch comes back empty or incomplete** — set **Render JavaScript** to true for pages that build
their content in the browser, or set a **Country Code** for sites that serve different content by
country. Most failed requests are not billed. A `502` for a target TLS error can still be, and then
carries an `x-billed-request-type` header.

**A crawl costs more than expected** — **Quote Site Crawl** returns the estimated cost before
anything is billed, and a started crawl stops before it exceeds its **Budget (USD)**, which defaults
to the quote. Lower **Max Pages** or the budget.
