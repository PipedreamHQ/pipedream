import piloterr from "../../piloterr.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "piloterr-get-website-crawler",
  name: "Get Website Crawler",
  description: "Fetch a public web page over fast HTTP, without running JavaScript, and return its HTML. Use **Render Website** for pages that build their content with JavaScript. [See the documentation](https://docs.piloterr.com/v2/api-reference/website/crawler)",
  version: "0.0.3",
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
      description: "The URL of the page to fetch, e.g. `https://example.com`.",
    },
    impersonateVersion: {
      type: "string",
      label: "Impersonate Version",
      description: "Browser version to impersonate, e.g. `chrome110`.",
      options: constants.BROWSER_VERSION,
      optional: true,
    },
    allowRedirects: {
      type: "boolean",
      label: "Allow Redirects",
      description: "Whether to follow HTTP redirects, e.g. `false` to stop at the first response. Defaults to `true`.",
      optional: true,
    },
    returnPageSource: {
      type: "boolean",
      label: "Return Page Source",
      description: "Whether to return the raw, unprocessed page source, e.g. `true`. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.scrapeWebsite({
      $,
      params: {
        query: this.url,
        impersonate_version: this.impersonateVersion,
        allow_redirects: this.allowRedirects,
        return_page_source: this.returnPageSource,
      },
    });
    $.export("$summary", `Fetched the HTML of ${this.url}`);
    return response;
  },
};
