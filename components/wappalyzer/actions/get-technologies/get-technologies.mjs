import wappalyzer from "../../wappalyzer.app.mjs";

export default {
  key: "wappalyzer-get-technologies",
  name: "Get Technologies",
  description: "Returns the details of technologies used on a specific URL. [See the documentation](https://www.wappalyzer.com/docs/api/v2/lookup/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    wappalyzer,
    urls: {
      type: "string[]",
      label: "URLs",
      description: "Between one and ten website URLs. Example: `https://example.com,https://example.org`. Multiple URLs are not supported with `recursive=false`.",
    },
    live: {
      type: "boolean",
      label: "Live",
      description: "Scan websites in real-time. Defaults to `false` to return cached results from our database (faster and more complete). If no record is found, `live=true` is automatically used instead. Use `recursive=false` to get live results in the same request.",
      optional: true,
    },
    recursive: {
      type: "boolean",
      label: "Recursive",
      description: "Index multiple pages (follows internal website links for increased coverage). Defaults to `true` for best results. If no record is found or `live=true` is used, using `recursive=true` causes the request to be completed asynchronously, meaning technologies will not be included in the initial response and the website is being crawled. To get the results when they become available, use `callback_url` or repeat the request at a later time (free for up to one hour). A crawl can take up to 15 minutes. We recommend using `callback_url` or repeating the request up to three times every five minutes. When using both `live=true` and `recursive=true`, `callback_url` is required and requests cost two credits instead of one.",
      optional: true,
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "When an asynchronous request completes, a POST request is made to the callback URL with the results. A callback URL is an public endpoint hosted on your own server. Example: `https://yourdomain.com/wappalyzer`. Required when using both `live=true` and `recursive=true`.",
      optional: true,
    },
    denoise: {
      type: "boolean",
      label: "Denoise",
      description: "Exclude low confidence results. Defaults to `true`. Setting this to `false` yields more results but is more likely to include false positives.",
      optional: true,
    },
    minAge: {
      type: "integer",
      label: "Min Age",
      description: "Return results that have been verified at least once before `min_age` months ago. Defaults to 0 for most recent results. Use a higher value in combination with `squash=false` and `max_age` for historic results grouped by month (up to 12 months per request).",
      optional: true,
    },
    maxAge: {
      type: "integer",
      label: "Max Age",
      description: "Return results that have been verified at least once in the last `max_age` months. Defaults to 2 for best results. To get the most up-to-date but fewer results, use `max_age=1`. For real-time results, use `live=true` instead. Use a higher value to get more but less recently verified results. These results are more likely to include websites that no longer use the technology. Use a higher value in combination with `squash=false` and optionally `min_age` for historic results grouped by month (up to 12 months per request).",
      optional: true,
    },
    squash: {
      type: "boolean",
      label: "Squash",
      description: "Merge monthly results into a single set. Defaults to `true`. Set to `false` to group results by month.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.wappalyzer.getTechnologies({
      $,
      params: {
        urls: this.urls.join(),
        live: this.live,
        recursive: this.recursive,
        callback_url: this.callbackUrl,
        denoise: this.denoise,
        min_age: this.minAge,
        max_age: this.maxAge,
        squash: this.squash,
      },
    });

    $.export("$summary", `Successfully retrieved technologies for ${this.urls.length} URL${this.urls.length === 1
      ? ""
      : "s"}.`);

    return response;
  },
};
