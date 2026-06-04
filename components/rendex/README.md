# Rendex

Rendex is a rendering API that turns HTML, a URL, or Markdown into an image or PDF with a single request. It is built for automation builders and AI agents.

# Example Use Cases

- Render an HTML invoice, report, or chart to a PNG inside a workflow.
- Capture a screenshot of a web page as a JPEG or WebP.
- Generate a PDF from HTML for an email attachment or document pipeline.

# Getting Started

1. Create a free account at [rendex.dev](https://rendex.dev).
2. Copy your API key from the dashboard (it looks like `rdx_...`).
3. In Pipedream, add the Rendex app and paste the API key when prompted.

That key authenticates every request as a bearer token against `https://api.rendex.dev`.

# Troubleshooting

- **401 Unauthorized**: the API key is missing or invalid. Re-copy it from the Rendex dashboard.
- **400 Bad Request**: provide exactly one input. Send either `html` or `url`, not both and not neither.
- **429 Too Many Requests**: you have hit your plan rate limit. Wait and retry, or upgrade your plan.

See the full API reference at [rendex.dev/docs](https://rendex.dev/docs).
