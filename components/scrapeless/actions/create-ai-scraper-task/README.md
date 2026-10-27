# Create AI Scraper Task

Create one asynchronous task using your connected Scrapeless account. The response
contains `task_id`; it does not mean that the answer has finished generating. Pass
that ID to **Get AI Scraper Result** and save the completed result promptly.

## Inputs

- **AI Engine**: choose an actor from the table below.
- **Prompt** and **Country**: required in prompt mode. For example, use
  `Explain how solar panels generate electricity.` and `US`. Prompt content is
  preserved; country codes are trimmed and converted to uppercase. Country
  availability depends on the engine and your account. See the
  [supported countries](https://docs.scrapeless.com/en/docs/ai-scraper/help/supported-countries/).
- **Engine Options**: an optional JSON object containing only the selected
  engine's supported fields. Use actual JSON boolean values, such as `false`, rather
  than strings such as `"false"`. Unknown fields and invalid types are rejected
  before making a request.
- **AI Mode URL**: an alternative to prompt mode, described below.
- **Webhook URL**: an optional HTTPS receiver, such as
  `https://example.com/ai-scraper-callback`. URLs containing credentials are
  rejected. This action sends `{ "webhook": { "url": "..." } }` to Scrapeless;
  configure your own receiver to match callbacks by `task_id` and persist results.
  It does not create a Pipedream webhook trigger. A successful creation response
  does not confirm callback delivery.

## Engine configurations

Each row is a minimal prompt-mode configuration when combined with the same
Prompt and Country. Set AI Engine to the actor shown and Engine Options to the
JSON example. No optional flag is inferred from fields present in a result.

| AI Engine / actor | Minimal Engine Options | All supported option fields |
| --- | --- | --- |
| [ChatGPT](https://docs.scrapeless.com/en/docs/ai-scraper/scrapers/chatgpt/) / `scraper.chatgpt` | `{}` | `web_search`, `shopping`, `should_fetch_share_link` |
| [Perplexity](https://docs.scrapeless.com/en/docs/ai-scraper/scrapers/perplexity/) / `scraper.perplexity` | `{}` | `web_search`, `should_fetch_share_link` |
| [Microsoft Copilot](https://docs.scrapeless.com/en/docs/ai-scraper/scrapers/copilot/) / `scraper.copilot` | `{"mode":"search"}` | `mode` (required), `should_fetch_share_link` |
| [Gemini](https://docs.scrapeless.com/en/docs/ai-scraper/scrapers/gemini/) / `scraper.gemini` | `{}` | `shopping` |
| [Google AI Mode](https://docs.scrapeless.com/en/docs/ai-scraper/scrapers/google-ai-mode/) / `scraper.aimode` | `{}` | `shopping`, `location`, `uule`, `should_fetch_share_link` |
| [Google AI Overview](https://docs.scrapeless.com/en/docs/ai-scraper/scrapers/google-ai-overview/) / `scraper.overview` | `{}` | `shopping`, `location`, `uule`, `should_fetch_share_link` |
| [Grok](https://docs.scrapeless.com/en/docs/ai-scraper/scrapers/grok/) / `scraper.grok` | `{"mode":"MODEL_MODE_AUTO"}` | `mode` (required), `should_fetch_share_link` |
| [Amazon Alexa](https://docs.scrapeless.com/en/docs/ai-scraper/scrapers/alexa/) / `scraper.alexa` | `{}` | None |

Copilot modes: `search`, `smart`, `chat`, `reasoning`, `study`.
Grok modes: `MODEL_MODE_FAST`, `MODEL_MODE_EXPERT`, `MODEL_MODE_AUTO`.
The component does not choose a default mode for these engines.

Example action inputs, excluding the separately selected Scrapeless connection:

```json
{
  "actor": "scraper.copilot",
  "prompt": "Explain how solar panels generate electricity.",
  "country": "US",
  "engineOptions": {
    "mode": "search",
    "should_fetch_share_link": false
  }
}
```

For ChatGPT, an expanded options example is:

```json
{ "web_search": true, "shopping": false, "should_fetch_share_link": false }
```

For AI Mode or AI Overview, provide either a canonical location or a nonempty
pre-encoded `uule` string. They are mutually exclusive:

```json
{
  "location": "New York,New York,United States",
  "shopping": false,
  "should_fetch_share_link": false
}
```

## Shopping and cost

In prompt mode this component explicitly sends `shopping: false` for ChatGPT,
Gemini, AI Mode, and AI Overview unless you provide a boolean value. This differs
from the documented server default of `true` for ChatGPT, AI Mode, and AI Overview;
Gemini already defaults to `false`.

Enabling shopping can incur twice the base charge when the documented product-data
conditions are met. Consult the selected engine's linked documentation and your
account's current pricing before enabling it. Other engines do not accept a
`shopping` input through this action. Tasks can consume credits independently of
whether you later retrieve their results.

## AI Mode URL mode

Select `scraper.aimode`, supply the complete AI Mode access link as **AI Mode URL**,
and omit Prompt, Country, and Engine Options (an empty object is also accepted).
The component sends only `input.url`, preserving the link exactly. A Webhook URL
may still be supplied at the top level.

The component requires an HTTPS URL without credentials. This is component input
validation, not a guarantee that every HTTPS link is a valid AI Mode access link.
No request is made to the link locally. URL mode does not add `shopping: false` or
any other input option; its cost behavior needs separate account validation.

## Output and retries

The complete API response is returned without wrapping it in an extra object.
A synthetic fixture, not a live API response:

```json
{ "task_id": "task-example-123" }
```

A missing or invalid `task_id`, or a conflicting failure status, produces an error
instead of a successful creation summary.

Each execution issues one POST to `/api/v2/scraper/request`, with a 30-second
request timeout and no automatic retry or redirect following. This timeout is
not a task-completion guarantee. A timeout or connection loss can leave a task
created and billed even though no response was received. Do not automatically
resubmit after an uncertain creation outcome. Preserve any known task ID and
investigate first. Also configure the caller's retries: one POST per action
execution does not guarantee one POST across repeated Connect or MCP executions.

HTTP errors preserve the API status and response body. Request configuration is
removed from error objects and debug exports. Task inputs can still appear in
the original API response; treat returned data as private.

For task states, result retention, and webhook fields, see
[Getting Started](https://docs.scrapeless.com/en/docs/ai-scraper/quickstart/quickstart/)
and [Task Lifecycle](https://docs.scrapeless.com/en/docs/ai-scraper/quickstart/task-lifecycle/).
