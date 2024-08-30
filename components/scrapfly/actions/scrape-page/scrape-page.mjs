import scrapfly from "../../scrapfly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "scrapfly-scrape-page",
  name: "Scrape Page",
  description: "Extract data from a specified web page. [See the documentation](https://scrapfly.io/docs/scrape-api/getting-started)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    scrapfly,
    url: {
      propDefinition: [
        scrapfly,
        "url",
      ],
    },
    key: {
      propDefinition: [
        scrapfly,
        "key",
      ],
    },
    contentType: {
      propDefinition: [
        scrapfly,
        "contentType",
      ],
      optional: true,
    },
    body: {
      propDefinition: [
        scrapfly,
        "body",
      ],
      optional: true,
    },
    proxyPool: {
      type: "string",
      label: "Proxy Pool",
      description: "Select the proxy pool to use.",
      optional: true,
    },
    headers: {
      type: "string[]",
      label: "Headers",
      description: "Pass custom headers to the request. Must be URL encoded.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Proxy country location.",
      optional: true,
    },
    lang: {
      type: "string",
      label: "Language",
      description: "Select page language.",
      optional: true,
    },
    os: {
      type: "string",
      label: "Operating System",
      description: "Operating System, if not selected it's random.",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Timeout in milliseconds.",
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "Format of the response.",
      options: [
        "raw",
        "text",
        "markdown",
        "clean_html",
        "json",
      ],
      optional: true,
    },
    retry: {
      type: "boolean",
      label: "Retry",
      description: "Improve reliability with retries on failure.",
      optional: true,
      default: true,
    },
    proxifiedResponse: {
      type: "boolean",
      label: "Proxified Response",
      description: "Return the content of the page directly.",
      optional: true,
      default: false,
    },
    debug: {
      type: "boolean",
      label: "Debug",
      description: "Store the API result and take a screenshot if rendering js is enabled.",
      optional: true,
      default: false,
    },
    correlationId: {
      type: "string",
      label: "Correlation ID",
      description: "Helper ID for correlating a group of scrapes.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Add tags to your scrapes to group them.",
      optional: true,
    },
    dns: {
      type: "boolean",
      label: "DNS",
      description: "Query and retrieve target DNS information.",
      optional: true,
      default: false,
    },
    ssl: {
      type: "boolean",
      label: "SSL",
      description: "SSL option.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const params = {
      proxy_pool: this.proxyPool,
      country: this.country,
      lang: this.lang,
      os: this.os,
      timeout: this.timeout,
      format: this.format,
      retry: this.retry,
      proxified_response: this.proxifiedResponse,
      debug: this.debug,
      correlation_id: this.correlationId,
      tags: this.tags,
      dns: this.dns,
      ssl: this.ssl,
    };

    if (this.headers) {
      params.headers = this.headers.reduce((acc, header) => {
        const [
          key,
          value,
        ] = header.split("=");
        acc[key] = value;
        return acc;
      }, {});
    }

    const response = await this.scrapfly.extractWebPageContent({
      url: this.url,
      key: this.key,
      ...params,
    });

    $.export("$summary", `Successfully scraped content from ${this.url}`);
    return response;
  },
};
