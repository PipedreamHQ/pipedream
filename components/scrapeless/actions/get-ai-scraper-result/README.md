# Get AI Scraper Result

Query an existing task once using its `task_id` from **Create AI Scraper Task**.
Select the same Scrapeless account and set **Task ID**, for example
`task-example-123`. Leading and trailing whitespace is removed. The ID is encoded
as one path segment; no fixed UUID format is assumed.

The full response is returned unchanged, including the engine's original
`task_result`, raw content, citations, and any additional fields.

## States and errors

| API status | Meaning and next step |
| --- | --- |
| `pending` | Queued; query the same task ID later. |
| `running` | Still processing; query the same task ID later. |
| `success` | Finished; save the full result immediately. If `task_result` is absent or null, the summary explicitly reports that no result payload was returned. |
| `failed` | Terminal task failure; the original `message` is retained in the response. The action returns the failure status without creating another task. |

Unknown or missing statuses, empty responses, and non-object responses produce a
response error. They are not treated as successful tasks.

HTTP errors such as 400, 401, 403, 410, 429, and 5xx remain request errors with
their status and response body. HTTP 410 means the result expired; do not recreate
the task automatically. For HTTP 429, follow `Retry-After` and apply a bounded
backoff in the caller. A transport error can be retried against the same task ID.
Request configuration is removed from error objects and debug exports; the
original response can contain task inputs and should be handled as private data.

Each execution performs one GET with a 30-second HTTP timeout and no redirects,
sleep, or polling inside the action.

## Result examples

These are synthetic fixtures, not recorded API responses:

```json
{ "status": "running" }
```

```json
{
  "status": "success",
  "task_result": {
    "md_text": "Example Alexa answer",
    "raw_text": "Example original text"
  }
}
```

The component does not flatten results or add `result_text`. For example, Alexa
uses `md_text` and `raw_text`. Google AI Overview may return empty `content` and
`rawtext` when no overview was triggered. A successful task status does not
promise nonempty answer text for every engine.

## Calling sequence and result storage

Results are retained for **4 minutes after completion**, according to
[Getting Started](https://docs.scrapeless.com/en/docs/ai-scraper/quickstart/quickstart/).
Read and persist them promptly, or configure a receiver with Webhook URL when
creating the task. A webhook being configured does not prove it was delivered.

Suggested caller policy:

1. Execute **Create AI Scraper Task** once and store its `task_id` durably.
2. Query **Get AI Scraper Result** approximately every 5 seconds while the status
   is `pending` or `running`.
3. Bound the whole wait to 180 seconds of wall-clock time, including time spent
   making requests. Bound each request by the smaller of 30 seconds and the
   remaining budget using the caller's request timeout or cancellation support.
4. On `success`, persist the entire response immediately. On `failed` or HTTP
   410, stop. On HTTP 429, respect `Retry-After`, but stop if its wait would exceed
   the remaining budget. Do not retry other HTTP errors automatically.
5. On deadline or transport failure, retain the task ID for follow-up. Never
   create a replacement task just to poll again.

The intervals and deadline are suggested caller limits, not a Scrapeless SLA.
If cancellation cannot stop an already dispatched platform execution, the caller
must stop starting further executions when its budget expires.

Implement this caller policy in your application using an authenticated adapter
for the Get action and your own result storage. Retain the original task ID when
the caller stops waiting; the task can continue running independently.

See [Task Lifecycle](https://docs.scrapeless.com/en/docs/ai-scraper/quickstart/task-lifecycle/)
for response and webhook structures. The component itself does not wait for a
task to finish.
