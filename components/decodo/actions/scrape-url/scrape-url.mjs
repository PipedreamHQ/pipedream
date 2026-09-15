import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import decodo from "../../decodo.app.mjs";

export default {
  key: "decodo-scrape-url",
  name: "Scrape URL",
  description: "Fetch the live contents of a web page through Decodo's scraping proxies. Use when you need the current content of a URL — a public page, a search-engine results page via a `target` template (e.g. `google_search` with a `query`), or a JavaScript-heavy page (set `headless` to `html` to render it first). Returns an array of results, each with the page `content`, the HTTP `status_code`, response `headers`, and `cookies`. Example: to read `https://example.com` as clean Markdown, set `url` to `https://example.com` and `markdown` to `true`; the returned `content` is the page converted to Markdown (`# Example Domain ...`). [See the documentation](https://help.decodo.com/docs/web-scraping-api-parameters)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    decodo,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to scrape. Required unless using a target template that accepts `query` instead. E.g. `https://ip.decodo.com`",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Search query for target templates that support it (instead of or in addition to `url`). E.g. `pizza near me`",
      optional: true,
    },
    target: {
      type: "string",
      label: "Target",
      description: "Target template for specialized scrapers. E.g. `google_search`. [See the documentation](https://help.decodo.com/docs/web-scraping-api-parameters)",
      optional: true,
    },
    proxyPool: {
      type: "string",
      label: "Proxy Pool",
      description: "`standard` handles simple pages; `premium` resolves complex anti-bot measures and is used for target templates. Defaults to `premium`.",
      options: constants.PROXY_POOL_OPTIONS,
      optional: true,
    },
    headless: {
      type: "string",
      label: "Headless",
      description: "`html` enables JavaScript rendering. `png` enables a screenshot response. Some target templates force JS rendering by default. [See the documentation](https://help.decodo.com/docs/web-scraping-api-parameters)",
      options: constants.HEADLESS_OPTIONS,
      optional: true,
    },
    geo: {
      type: "string",
      label: "Geo",
      description: "The geographical location for the request. Defaults to auto-randomized. E.g. `United States`",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "Top-level domain for localized results. E.g. `com`, `co.uk`, `fr`. Defaults to `com`.",
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Changes the search page web interface language (not the results). Matched with the domain parameter by default. E.g. `en-US`, `en-GB`",
      optional: true,
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Additional request headers to send to the target. By default these are not forwarded unless `Force Headers` is enabled. E.g. `{\"User-Agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36\"}`",
      optional: true,
    },
    cookies: {
      type: "object",
      label: "Cookies",
      description: "Cookies to send with the request, e.g. to access pages as a logged-in user. By default these are not forwarded unless `Force Cookies` is enabled. E.g. `{\"sessionid\": \"8e1f3b56-7abc-47e6-b2e2-1d273b0a1c4d\", \"logged_in\": \"true\", \"locale\": \"en-US\"}`",
      optional: true,
    },
    forceCookies: {
      type: "boolean",
      label: "Force Cookies",
      description: "By default, user-provided cookies are not forwarded to the target. Set to `true` to override this behaviour.",
      optional: true,
    },
    forceHeaders: {
      type: "boolean",
      label: "Force Headers",
      description: "By default, user-provided headers are not forwarded to the target. Set to `true` to override this behaviour.",
      optional: true,
    },
    deviceType: {
      type: "string",
      label: "Device Type",
      description: "Device type and browser for the request. Defaults to `desktop`. [See the documentation](https://help.decodo.com/docs/web-scraping-api-device-types)",
      options: constants.DEVICE_TYPE_OPTIONS,
      optional: true,
    },
    parse: {
      type: "boolean",
      label: "Parse",
      description: "For certain target templates, set to `true` to retrieve structured/parsed data instead of raw HTML.",
      optional: true,
    },
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "Reuse the same IP for multiple requests for up to 10 minutes. E.g. `1234`",
      optional: true,
    },
    httpMethod: {
      type: "string",
      label: "HTTP Method",
      description: "HTTP method for the target request. Defaults to `GET`. Use `POST` with a base64-encoded `Payload`.",
      options: constants.HTTP_METHOD_OPTIONS,
      optional: true,
    },
    payload: {
      type: "string",
      label: "Payload",
      description: "Base64-encoded POST request body. Used when `HTTP Method` is `POST`.",
      optional: true,
    },
    successfulStatusCodes: {
      type: "integer[]",
      label: "Successful Status Codes",
      description: "HTTP response codes to treat as successful so content is still returned. E.g. `[401, 404]`",
      optional: true,
    },
    markdown: {
      type: "boolean",
      label: "Markdown",
      description: "Parse HTML output into Markdown. Useful for reducing tokens when feeding results into LLM models.",
      optional: true,
    },
    xhr: {
      type: "boolean",
      label: "XHR",
      description: "When enabled, retrieves a list of XHR and fetch requests made by the page.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.url && !(this.target && this.query)) {
      throw new ConfigurationError("Provide a URL to scrape, or a Target template (e.g. `google_search`) together with a Query.");
    }

    const response = await this.decodo.scrapeUrl({
      $,
      data: {
        url: this.url,
        query: this.query,
        target: this.target,
        proxy_pool: this.proxyPool,
        headless: this.headless,
        geo: this.geo,
        domain: this.domain,
        locale: this.locale,
        headers: this.headers,
        cookies: this.cookies,
        force_cookies: this.forceCookies,
        force_headers: this.forceHeaders,
        device_type: this.deviceType,
        parse: this.parse,
        session_id: this.sessionId,
        http_method: this.httpMethod,
        payload: this.payload,
        successful_status_codes: this.successfulStatusCodes,
        markdown: this.markdown,
        xhr: this.xhr,
      },
    });

    // Decodo reports an unscrapable target as HTTP 200 with `{ status: "failed",
    // message, ... }` and no `results`, so a non-2xx failure is not the only
    // failure mode. Surface that documented failure instead of returning an
    // empty success.
    if (!response?.results) {
      throw new Error(`Decodo could not scrape the target (status: ${response?.status || "failed"}): ${response?.message || "no results were returned"}`);
    }

    $.export("$summary", `Successfully scraped ${this.url || this.query || this.target}`);

    return response.results;
  },
};
