# Run AI Scraper

Create one task and automatically wait for its answer in a single Pipedream action.
Choose ChatGPT, Perplexity, Microsoft Copilot, Gemini, Google AI Mode, Google AI
Overview, Grok, or Amazon Alexa. The action creates one task, queries its existing
ID every five seconds, and returns when the task succeeds, fails, or reaches the
configured waiting limit.

## Setup

1. Connect your Scrapeless account using an API key.
2. Add **Run AI Scraper** to your workflow and select **AI Engine**.
3. Enter a **Prompt** and **Country**. Configure **Engine Options** if needed.
   Copilot requires a mode such as `search`; Grok requires a mode such as
   `MODEL_MODE_AUTO`. See the engine configurations below.
4. Leave **Max Wait Seconds** at 180, or choose an integer from 1 to 240.
5. Increase your workflow execution timeout to cover creation, waiting, and any
   other steps. For the default 180-second wait, a 240-second workflow timeout is
   a reasonable starting point; allow more for other steps. With a 240-second
   wait, allow at least 270 seconds plus time for other steps.

For Google AI Mode URL input, supply **AI Mode URL** and omit Prompt, Country, and
Engine Options. This action does not configure a webhook; it retrieves results
through the result endpoint.

## Output

A completed response includes the original API status, message, full `task_result`,
and any other API response fields, with the original creation `task_id` attached:

```json
{
  "task_id": "task-example-123",
  "status": "success",
  "task_result": {
    "md_text": "The answer returned by the selected engine."
  }
}
```

The payload above is illustrative; result fields depend on the engine. A terminal
`failed` task is returned as API data, including its original message. The action
does not turn a failed task into a successful answer. If the API reports success
without a result payload, the summary explicitly says that the payload is absent.

If the waiting budget is exhausted, the action returns a local timeout outcome:

```json
{
  "task_id": "task-example-123",
  "status": "timeout",
  "last_response": {
    "status": "running"
  }
}
```

`timeout` is a component outcome, not a Scrapeless task status. `last_response` is
present only if a valid result response was received before stopping. Waiting can
stop before the exact limit when the next five-second poll, or a rate-limit delay,
would exceed the remaining budget. The task is not canceled. To continue lookup,
run **Run AI Scraper** again with **Existing Task ID** set to the returned ID.
This query-only path does not create another task; creation inputs are ignored.
The component also exports `task_id` immediately after creation, before waiting.

## Limits and recovery

- The waiting budget starts after task creation. Creation has its own 30-second
  HTTP timeout. Each result query is limited to the smaller of 30 seconds and the
  remaining budget.
- HTTP 429 result queries respect `Retry-After`, with a minimum five-second delay.
  Other HTTP errors, including expired results (410), and transport errors are
  propagated. After creation, the error and step export retain the recovery ID.
- Creation is never automatically repeated by this action. If creation times out
  or its response lacks a usable ID, a task may already exist. Do not automatically
  retry the entire action. If an ID is available, query that ID instead.
- Waiting occupies the current execution and may consume Pipedream compute credits.
  Workflow, Connect, MCP, and caller timeouts still apply. This component cannot
  raise those limits, and it does not guarantee completion within a single call.
- Save completed results promptly: Scrapeless retains completed results for about
  four minutes. Returning a result does not archive it in external storage.

For an existing task, set **Existing Task ID** (for example, `task-example-123`).
AI Engine, Prompt, Country, AI Mode URL, and Engine Options are ignored on this
path. An invalid supplied ID is rejected locally; it never falls back to creation.
Leave Existing Task ID unset only when intentionally starting a new task.

A timeout remains a timeout until a later lookup actually returns a terminal
state. Resuming after the provider retention window may return HTTP 410.

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

For AI Mode or AI Overview, provide either a Google canonical location name or a
pre-encoded `uule` value. They are mutually exclusive:

```json
{
  "location": "New York,New York,United States",
  "shopping": false,
  "should_fetch_share_link": false
}
```

Copy `location` from the **Canonical Name** column in
[Google's geo-target list](https://developers.google.com/google-ads/api/data/geotargets).
Names have varying numbers of geographic levels; a country can be a single name.
The catalog also contains obsolete entries. Local validation rejects surrounding whitespace, control characters,
invalid Unicode, empty comma-separated levels, URLs, and raw coordinate pairs. It
does not impose a three-part hierarchy or download the catalog during execution.
Exact catalog membership and current engine support remain server-side checks.

The component supports the known name-based `w+` and GPS-based `a+` UULE envelopes.
For example:

```json
{ "uule": "w+CAIQICIWSmFpcHVyLFJhamFzdGhhbixJbmRpYQ" }
```

Encoding checks cover the prefix, `Base64` or `Base64url` payload, optional padding,
and a nonempty name or valid coordinate fields. Percent escaping is checked once.
The original value is forwarded unchanged. Supply the encoded value itself, not a
location name, a whole Google URL, or an `uule=` query fragment. The linked vendor
references do not specify a complete UULE wire schema; these checks cover the
supported envelopes and do not guarantee provider acceptance or live success.

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
The component sends only `input.url`, preserving the link exactly.

The component requires an HTTPS URL without credentials. This is component input
validation, not a guarantee that every HTTPS link is a valid AI Mode access link.
No request is made to the link locally. URL mode does not add `shopping: false` or
any other input option; its cost behavior needs separate account validation.

## References

- [Scrapeless AI Scraper task lifecycle](https://docs.scrapeless.com/en/docs/ai-scraper/quickstart/task-lifecycle/)
- [Scrapeless AI Scraper quickstart](https://docs.scrapeless.com/en/docs/ai-scraper/quickstart/quickstart/)
- [Pipedream workflow execution limits](https://pipedream.com/docs/workflows/limits#time-per-execution)
