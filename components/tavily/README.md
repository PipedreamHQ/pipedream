# Tavily actions

Connect your Tavily account once with an API key from the [Tavily dashboard](https://app.tavily.com/). Both actions use this connection and send the key in the `Authorization: Bearer` header.

## MCP connection options

Pipedream's [Tavily MCP integration](https://mcp.pipedream.com/app/tavily) exposes published Pipedream actions as MCP tools. These actions call Tavily's REST API using the connected Tavily API key. Pipedream generates MCP tools from its [action registry](https://pipedream.com/docs/connect/mcp#supported-tools); local changes and private test publications do not update the public listing. Verify the available tools after Pipedream releases an update.

To connect an MCP client directly to Tavily, use the official remote server:

```text
https://mcp.tavily.com/mcp/
```

Compatible clients can sign in through Tavily's OAuth flow. API key authentication is also supported, including through the Authorization header. See the [official Tavily MCP setup guide](https://docs.tavily.com/documentation/mcp) and [OAuth instructions](https://docs.tavily.com/documentation/mcp#oauth-authentication).

This direct connection is configured in your MCP client. It is separate from Pipedream's Tavily account connection and does not enable OAuth for these REST actions. Use the native actions for Pipedream workflows, or the official server when connecting your MCP client directly to Tavily.

## Search: Send Query

Enter a query and select any optional controls for search depth, result count, topic, dates, domains, language, images, answer generation, or page content. Unset options use the API defaults. Explicit `false` values and a maximum result count of `0` are preserved.

- Enable **Include Answer** to generate an answer. **Answer Depth** selects `basic` or `advanced` detail when that option is enabled.
- Enable **Include Raw Content** to return full page content. **Raw Content Format** selects `markdown` or `text` when that option is enabled.
- **Include Domains Mode** requires at least one included domain. **Filter by Language** requires a language. **Safe Search** supports `basic` and `advanced` search depths.
- Search returns the full API response, including `results`, optional `answer` and images, `request_id`, and usage when requested. The step summary reports the result count, even when answer generation is disabled.

Basic, fast, and ultra-fast searches cost 1 API credit; advanced searches cost 2. Automatic Parameters can select advanced search. Set Search Depth explicitly to control that choice. Full content and generated answers can increase response size and latency.

See the [Search API reference](https://docs.tavily.com/documentation/api-reference/endpoint/search) for accepted country values, parameter details, and current limits.

## Extract Content

Provide between 1 and 20 URLs. Optional controls include extraction depth, a query for relevant chunks, chunks per source (1–5), content format, images, icons, credit usage, and an extraction timeout (1–60 seconds, including decimals). Chunks per Source only applies when a Query is provided.

The full response is returned, including both `results` and `failed_results`. A request may succeed while individual URLs fail. The step summary reports both counts, including when every URL fails. Inspect `failed_results` before passing content to the next step, and retry only the failed URLs where appropriate.

See the [Extract API reference](https://docs.tavily.com/documentation/api-reference/endpoint/extract) and [credit guide](https://docs.tavily.com/documentation/api-credits) for current extraction costs and limits. Advanced extraction costs more than basic extraction.

## Example: search, then extract

1. Add **Send Query**, enter a query such as `Tavily API authentication`, and set Maximum Results to `5`.
2. Add **Extract Content** using the same Tavily connection.
3. Map the Search step's result URLs into the URLs input. For a Search step named `search`, use `{{steps.search.$return_value.results.map(result => result.url)}}`.
4. Optionally set Query to focus the extracted content. Process successful results and handle failed URLs separately.

## Troubleshooting

- **401:** Check that the connected API key is valid and has not been revoked.
- **429:** Check the account's rate limit and retry with a delay.
- **Credit or quota errors:** Check the API response and the account's available credits. Request Include Usage to observe consumption.
- **Failed URLs:** Inspect each returned error. Advanced extraction or a longer timeout may help with complex or slow pages, at the documented cost.

Upstream request errors propagate to Pipedream. The actions do not automatically retry requests or change search or extraction depth.

## Development

From the repository root, run:

```sh
pnpm --filter @pipedream/tavily test
```

The automated tests use a local HTTP server and a dummy key; they do not call Tavily or consume credits. They cover header authentication, parameter mapping, legacy boolean inputs, omitted defaults, validation, partial extraction failures, and propagation of HTTP errors. They do not verify Pipedream's hosted runtime, account connection UI, live Tavily responses, or MCP tool discovery.