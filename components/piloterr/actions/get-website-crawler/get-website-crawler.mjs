import piloterr from "../../piloterr.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "piloterr-get-website-crawler",
  name: "Get Website Crawler",
  description: "Obtains HTML from a given website through web scraping for high performance access and interpretation. [See the documentation](https://docs.piloterr.com/v2/api-reference/website/crawler)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    piloterr,
    url: {
      type: "string",
      label: "Website URL",
      description: "The URL of the website to obtain HTML from",
    },
    impersonateVersion: {
      type: "string",
      label: "Impersonate Version",
      description: "Impersonate a browser version",
      options: constants.BROWSER_VERSION,
      optional: true,
    },
    allowRedirects: {
      type: "boolean",
      label: "Allow Redirects",
      description: "If set to `false`, do not follow redirects. `true` by default.",
      optional: true,
    },
    returnPageSource: {
      type: "boolean",
      label: "Return Page Source",
      description: "If set to `false`, the response will be a JSON object with the response body of the page. `true` by default.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.piloterr.scrapeWebsite({
      params: {
        query: this.url,
        impersonate_version: this.impersonateVersion,
        allow_redirects: this.allowRedirects,
        return_page_source: this.returnPageSource,
      },
      $,
    });
    $.export("$summary", `Successfully obtained HTML from ${this.url}`);
    return response;
  },
};
