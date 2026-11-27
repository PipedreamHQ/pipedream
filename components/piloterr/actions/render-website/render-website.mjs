import piloterr from "../../piloterr.app.mjs";

export default {
  key: "piloterr-render-website",
  name: "Render Website",
  description: "Render a JavaScript-heavy page in a headless browser and return the HTML after rendering. Use **Get Website Crawler** instead for static pages, which is faster. [See the documentation](https://docs.piloterr.com/v2/api-reference/website/rendering)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    piloterr,
    url: {
      type: "string",
      label: "Website URL",
      description: "The URL of the page to render, e.g. `https://example.com`.",
    },
    waitInSeconds: {
      type: "integer",
      label: "Wait In Seconds",
      description: "Seconds to wait after the page loads before reading the HTML, e.g. `3`. Defaults to `0`.",
      min: 0,
      optional: true,
    },
    blockAds: {
      type: "boolean",
      label: "Block Ads",
      description: "Whether to block ad requests while rendering, e.g. `true`. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.renderWebsite({
      $,
      params: {
        query: this.url,
        wait_in_seconds: this.waitInSeconds,
        block_ads: this.blockAds,
      },
    });
    $.export("$summary", `Rendered the HTML of ${this.url}`);
    return response;
  },
};
