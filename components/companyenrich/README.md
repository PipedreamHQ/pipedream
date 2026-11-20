# Overview

CompanyEnrich provides company and people data through APIs. These Pipedream actions support company enrichment, account discovery, lookalike search, workforce research and professional profile lookup using API v2. They are intended for Pipedream Connect and MCP as well as supported action steps.

# Getting Started

## Connection

Connect your CompanyEnrich account using an API key from the [CompanyEnrich dashboard](https://app.companyenrich.com/). Enter the key without the `Bearer` prefix. The connection supplies credentials; actions do not accept keys as ordinary inputs.

The native Pipedream app registration is requested in [issue #22385](https://github.com/PipedreamHQ/pipedream/issues/22385). Source components alone do not register the connected app. Hosted execution remains pending that registration and a connected test account.

For registration, use app slug `companyenrich` with a secret `api_key` field and bearer authentication to `https://api.companyenrich.com`. Validate with `GET /v2/me`, which consumes no credits. Return only the account ID, credit usage and capabilities from that response; do not expose a credential returned by the service.

## Actions

| Action | Purpose |
| --- | --- |
| [Enrich Company](actions/enrich-company/README.md) | Enrich a company from its domain. |
| [Get Company](actions/get-company/README.md) | Retrieve a company by its ID from **Search Companies** or **Autocomplete Companies**. |
| [Enrich Company by Properties](actions/enrich-company-by-properties/README.md) | Resolve a company from its name or social identifiers. |
| [Enrich Companies in Batch](actions/enrich-companies/README.md) | Enrich 1–50 domains in one request. |
| [Search Companies](actions/search-companies/README.md) | Search companies using structured filters, a semantic query, or lookalike seeds. |
| [Count Companies](actions/count-companies/README.md) | Count matching companies without consuming credits. |
| [Preview Companies](actions/preview-companies/README.md) | Preview up to 25 company summaries without consuming credits. |
| [Search People](actions/search-people/README.md) | Find professional profiles with person and employer filters. |
| [Count People](actions/count-people/README.md) | Count matching people without consuming credits. |
| [Preview People](actions/preview-people/README.md) | Preview up to 10 person summaries without consuming credits. |
| [Get Company Workforce](actions/get-company-workforce/README.md) | Retrieve 12-month pages of workforce history for a company ID or domain. |
| [Get Person](actions/get-person/README.md) | Retrieve a professional profile by its ID from **Search People**. |
| [Enrich Person by Email](actions/enrich-person/README.md) | Find the best matching person for a known work email. |
| [Find Work Email (Beta)](actions/find-work-email/README.md) | Resolve a work email for a person from **Search People**. |
| [Autocomplete Companies](actions/autocomplete-companies/README.md) | Find up to 10 companies by a domain prefix. |
| [Lookup Keywords](actions/lookup-keywords/README.md) | Find up to 10 keywords suggestions for search filters. |
| [Lookup Technologies](actions/lookup-technologies/README.md) | Find up to 10 technologies suggestions for search filters. |
| [Lookup Positions](actions/lookup-positions/README.md) | Find up to 10 positions suggestions for search filters. |
| [Get Regions](actions/get-regions/README.md) | List geographic regions and their country codes for company and people filters. |
| [Get Country](actions/get-country/README.md) | Retrieve country metadata using a two-letter code from **Search Countries**. |
| [Search Countries](actions/search-countries/README.md) | Search countries by a case-insensitive name substring. |
| [Search States](actions/search-states/README.md) | Search states by a case-insensitive name substring. |
| [Search Cities](actions/search-cities/README.md) | Search cities by a case-insensitive name substring. |
| [List Industries](actions/list-industries/README.md) | List industries and their NAICS code prefixes. |
| [Get Account](actions/get-account/README.md) | Read your account credit usage and capabilities without consuming credits. |

## Search and credit controls

Company search supports ordinary filters, semantic search or lookalike seeds. Semantic and lookalike queries cannot be combined. People search supports person filters and a nested company query. Company queries using `query`, keyword, technology, funding, workforce, `reportedEmployees`, or required-feature filters, or semantic or lookalike queries, match people at only the 1,000 best-matching companies. Advanced filter inputs accept JSON objects using the current [company](https://docs.companyenrich.com/reference/post_v2-companies-search) and [people](https://docs.companyenrich.com/reference/post_v2-people-search) schemas. Scalar, array and supported inclusion/exclusion filter values pass through unchanged.

Search and geography actions use a default page size of 10 and a maximum of 100 records. Workforce returns one year per call. **Maximum Pages** defaults to `1`, which preserves the original single-page API response. Set it to `2`–`100` to follow cursors automatically, stopping at the chosen limit, the end of results, or a 20-second budget for collecting multiple pages. This mode returns `{ pages, nextCursor }`: every page retains its complete response, record order, search scores and workforce history window metadata. More pages can consume more credits.

Use the final `nextCursor` with the same inputs to resume; cursors expire after 30 minutes. If the pagination time budget expires after a completed page, the action returns the completed pages and cursor with `partial: true` and `stoppedReason: "time_budget"`. It cancels any in-flight request at that limit. If no page completed, it throws an error. Single-page mode is unchanged. An aborted paid request may still consume credits; geographic lookups remain free.

Multi-page mode exports `paginationProgress` after each completed page with the collected pages and cursor. This can help inspect a failed run, but it is not a durable checkpoint and may be unavailable after a hard workflow timeout. Allow enough workflow execution time, including time consumed by earlier steps. For recovery across runs, process one page at a time and save the page and cursor to durable storage before continuing.

Pagination never requests pages ahead of processing. No action polls pending results or retries failures. Errors other than expiration of the pagination time budget still fail the action, so rerunning paid searches can charge again for earlier successful pages. Pipedream-level retries and repeated agent calls can also issue additional billable requests.

Counts and previews omit pagination and expansions. Count responses preserve both `count` (accessible under the plan) and `total` (before plan limits). Previews consume no credits but require the relevant plan capability. **Get Account** reports available capabilities and credit usage without returning credentials.

Paid expansions are optional. Company financial data, keywords, NAICS codes and technologies each add 1 credit per returned company; workforce adds 5. People education adds 1 credit per returned person. Search charges and empty-result minimums depend on the selected operation. Consult each action and the [credit guide](https://docs.companyenrich.com/docs/credits) before running large workloads.

**Find Work Email (Beta)** preserves `found`, `not-found`, `unavailable` and `pending` outcomes. It does not promise an email or poll automatically. People search itself does not return email addresses.

## Replacing another provider

Rebuild enrichment and discovery steps using CompanyEnrich inputs and outputs. Provider IDs and response fields are different: obtain CompanyEnrich IDs from its own search, lookup or enrichment actions, then update downstream mappings. Validate sample matches before updating CRM records.

These actions do not replace provider-specific business or prospect event subscriptions. No compatible CompanyEnrich webhook contract is documented in the current v2 reference. Bulk jobs, saved-list exports and other legacy routes are also outside the current v2 contract; they are not silently mixed into this app.

# Troubleshooting

For authentication failures, check the connected API key. For credit or capability errors, use **Get Account** and consult the endpoint requirements. If a cursor expires, restart without it; preserve the same filters and expansions when resuming a valid cursor.

## Development and validation

Run `npm test --prefix components/companyenrich` from the repository root for offline request-contract tests. The tests use synthetic records and mocked transport; they do not make provider calls or establish live account access, billing or hosted authentication behavior.

After Pipedream registers the app, publish an action privately in a Connect development environment and execute it with a connected test account using the [official action quickstart](https://pipedream.com/docs/components/contributing/actions-quickstart). Complete a hosted smoke test before requesting registry publication. This contribution has not performed that hosted test.

Endpoint coverage was checked against the [public API index](https://docs.companyenrich.com/llms.txt) on 11 November 2026: all 25 documented v2 operations have named actions. The email lookup is explicitly beta; no broader availability or reliability claim is made.

The app uses `@pipedream/platform` Axios to retain Pipedream execution context and `json-bigint` to preserve large person IDs. The published CompanyEnrich JavaScript SDK version 1.0.1 parses response JSON using standard `JSON.parse`, which can round 64-bit IDs. Direct API access avoids that loss and does not add SDK retries. See the [SDK transport implementation](https://github.com/CompanyEnrich/companyenrich-js-sdk/blob/68c166b6608f7b0bcdb768810b181166d263dbcf/src/core/http.ts).
