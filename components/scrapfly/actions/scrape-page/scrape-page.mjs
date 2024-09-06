import { ConfigurationError } from "@pipedream/platform";
import {
  FORMAT_OPTIONS,
  PROXY_COUNTRY_OPTIONS,
  PROXY_POOL_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import scrapfly from "../../scrapfly.app.mjs";

export default {
  key: "scrapfly-scrape-page",
  name: "Scrape Page",
  description: "Extract data from a specified web page. [See the documentation](https://scrapfly.io/docs/scrape-api/getting-started)",
  version: "0.0.1",
  type: "action",
  props: {
    scrapfly,
    url: {
      propDefinition: [
        scrapfly,
        "url",
      ],
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Pass custom headers to the request.",
      optional: true,
    },
    lang: {
      type: "string",
      label: "Language",
      description: "Select page language. By default it uses the language of the selected proxy location. Behind the scenes, it configures the `Accept-Language` HTTP header. If the website support the language, the content will be in that lang. **Note: you cannot set headers `Accept-Language` header manually**. [See the documentation](https://scrapfly.io/docs/scrape-api/getting-started#spec)",
      optional: true,
    },
    os: {
      type: "string",
      label: "Operating System",
      description: "Operating System, if not selected it's random. **Note: you cannot set os parameter and `User-Agent` header at the same time.** [See the documentation](https://scrapfly.io/docs/scrape-api/getting-started#spec)",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Timeout in milliseconds. It represents the maximum time allowed for Scrapfly to perform the scrape. Since `timeout` is not trivial to understand see our [extended documentation on timeouts](https://scrapfly.io/docs/scrape-api/understand-timeout)",
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "Format of the response.",
      options: FORMAT_OPTIONS,
      optional: true,
    },
    retry: {
      type: "boolean",
      label: "Retry",
      description: "Improve reliability with retries on failure.",
      optional: true,
    },
    proxifiedResponse: {
      type: "boolean",
      label: "Proxified Response",
      description: "Return the content of the page directly.",
      optional: true,
    },
    debug: {
      type: "boolean",
      label: "Debug",
      description: "Store the API result and take a screenshot if rendering js is enabled.",
      optional: true,
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
    },
    ssl: {
      type: "boolean",
      label: "SSL",
      description: "SSL option.",
      optional: true,
    },
    proxyPool: {
      type: "string",
      label: "Proxy Pool",
      description: "Select the proxy pool to use.",
      optional: true,
      options: PROXY_POOL_OPTIONS,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    props.country = {
      type: "string",
      label: "Country",
      description: "Proxy country location. If not set it chooses a random location available. A reference to a country must be ISO 3166 alpha-2 (2 letters). The available countries are defined by the proxy pool you use. [See the documentation](https://scrapfly.io/docs/scrape-api/getting-started#spec)",
      optional: true,
      options: PROXY_COUNTRY_OPTIONS[this.proxyPool],
    };
    return props;
  },
  async run({ $ }) {
    try {
      let headers = "";
      if (this.headers) {
        headers = Object.keys(parseObject(this.headers))
          .reduce((acc, key) => {
            acc.push(`headers[${key}]=${encodeURIComponent(this.headers[key])}`);
            return acc;
          }, []);
      }
      const params = {
        url: this.url,
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
        tags: parseObject(this.tags),
        dns: this.dns,
        ssl: this.ssl,
        headers,
      };

      const response = await this.scrapfly.extractWebPageContent({
        $,
        params,
      });

      $.export("$summary", `Successfully scraped content from ${this.url}`);
      return response;
    } catch ({ response: { data: { message } } }) {
      throw new ConfigurationError(message);
    }
  },
};
