# Overview

FastAF retrieves public web content, search results, product data, public profiles,
video transcripts and screenshots through one credit-based API.

These actions use the [API-key REST API](https://fastaf.co/docs/#auth), not x402 or
MCP. Each execution makes one authenticated request. Search responses retain the
original structured object, including result sections and pagination metadata,
rather than discarding context and returning only an organic-results array.

| Action key | Action | REST endpoint | Typical credits |
| --- | --- | --- | --- |
| `fastaf-scrape` | Scrape Page | `POST /v1/scrape` | 1 static; options can increase cost |
| `fastaf-search` | Search Web | `POST /v1/serp` | 5; advanced search 10 |
| `fastaf-extract` | Extract Page Data | `POST /v1/scrape` | Scrape base cost plus 10 |
| `fastaf-screenshot` | Capture Screenshot | `POST /v1/screenshot` | 5 |
| `fastaf-amazon` | Get Amazon Data | `POST /v1/amazon` | Search/product 1; offers/bestsellers 5 |
| `fastaf-maps` | Search Maps | `POST /v1/maps` | 5 |
| `fastaf-linkedin` | Get LinkedIn Profile | `POST /v1/linkedin` | 60 |
| `fastaf-youtube` | Get YouTube Data | `POST /v1/youtube` | Transcript 1; search 5 |
| `fastaf-news` | Search News | `POST /v1/news` | 5 |
| `fastaf-jobs` | Search Jobs | `POST /v1/jobs` | 5 |

The [live OpenAPI specification](https://api.fastaf.co/openapi.json) is the source
of truth for endpoint inputs and response formats. Actions read external data
without modifying target records, but do consume FastAF credits. They therefore
use `destructiveHint: false`, `openWorldHint: true`, and `readOnlyHint: true`.

## Example Use Cases

- Convert a public page into markdown for a document-processing workflow.
- Extract product fields with an AI prompt or a set of extraction instructions.
- Monitor one page of search, Maps, news or job results on a schedule.
- Retrieve a transcript, public profile or Amazon resource for another workflow step.
- Capture a screenshot and pass its file path to a file-upload step.

# Getting Started

1. Create a [FastAF account](https://fastaf.co/signup/), confirm the account as
   instructed, and create an API key in the [dashboard](https://fastaf.co/dashboard/).
2. Connect the FastAF app in Pipedream with that API key. The app's simple-auth
   field must be named `api_key` and marked secret in Pipedream's managed app
   configuration. The component reads `this.$auth.api_key` and sends
   `Authorization: Bearer <api_key>`; keys are never query parameters or action props.
3. Choose an action and fill its required inputs. Resource-dependent fields are
   explained in the prop descriptions and action README files.
4. Reference the returned data in later steps. Scrape/extract text responses are
   wrapped as `{ content }`; structured responses retain the API's original shape.

## App Registration

For a new integration, Pipedream must register the `fastaf` app and its simple
API-key authentication before the components can be reviewed or connected. The
app module references that managed configuration; it does not create it. App
registration, publishing and hosted Pipedream execution are separate steps.

## Defaults and Cost Control

- Leave rendering unset to preserve FastAF's site-specific defaults. Most pages
  are static by default; Booking defaults to rendering with an 8000 ms wait.
- Scrape base pricing is 1 credit for static pages, 5 with rendering, 10 with
  premium proxies or a selected proxy country, and 25 for rendering plus either.
  Challenge mode uses 10 base credits and cannot be combined with rendering,
  premium proxies or a country. AI extraction adds 10 credits once per request.
- Reddit is best-effort feed retrieval, not a guaranteed supported target.
  Zillow and eBay require their dedicated APIs, not the Scrape Page action.
- Extract Page Data uses `ai_query` and/or JSON-encoded `ai_extract_rules` on
  `/v1/scrape`. There is no separate `/v1/extract` endpoint.
- Search, news and job actions request one page per execution. This is a deliberate
  exception to unbounded list pagination: each extra page spends credits. Set
  the next page or continuation token explicitly in another execution. Maps uses
  offsets 0, 20, 40, up to 100; Amazon starts at page 1. The Amazon full-list option
  can return a combined bestseller list in one request.
- No automatic HTTP retries are performed. Inspect failures before rerunning an
  action, particularly after a network timeout whose billing outcome is unknown.
- Caller headers, cookies and authorization are not passed to scrape targets.
  Unsupported custom-header maps are intentionally not exposed as props.

## Screenshot Files

Capture Screenshot requests binary image data and writes a uniquely named file
in the runtime temporary directory (`/tmp` on Pipedream). It returns `filePath`,
`contentType` and `bytes`, not a large base64 string or an Axios response object.
Use the optional output-directory prop for File Stash synchronization through
Connect. Temporary files are not durable storage; upload or consume the file in
subsequent steps.

# Troubleshooting

- **400:** Check required fields, numeric ranges and incompatible options.
- **401:** Reconnect with a valid API key.
- **402:** Check credit balance and any free-request eligibility.
- **403:** Check account activation and verification.
- **429 / 503:** Wait before another execution; inspect service capacity.
- **502 / 504:** The target may be unavailable, blocked, empty or too slow.

Error messages and summaries deliberately omit credentials and raw request
configurations. Error diagnostics expose only the HTTP status. Do not put API
keys in URLs or enable custom request debugging. See the
[error reference](https://fastaf.co/docs/#errors) and
[credit documentation](https://fastaf.co/docs/#credits).
