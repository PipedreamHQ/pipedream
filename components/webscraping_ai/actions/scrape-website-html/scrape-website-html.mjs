import webscrapingAI from "../../webscraping_ai.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "webscraping_ai-scrape-website-html",
  name: "Scrape Website HTML",
  description: "Returns the full HTML content of a webpage specified by the URL. [See the documentation](https://webscraping.ai/docs#tag/HTML/operation/getHTML):",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    webscrapingAI,
    targetUrl: {
      propDefinition: [
        webscrapingAI,
        "targetUrl",
      ],
    },
    headers: {
      propDefinition: [
        webscrapingAI,
        "headers",
      ],
    },
    timeout: {
      propDefinition: [
        webscrapingAI,
        "timeout",
      ],
    },
    js: {
      propDefinition: [
        webscrapingAI,
        "js",
      ],
    },
    jsTimeout: {
      propDefinition: [
        webscrapingAI,
        "jsTimeout",
      ],
    },
    waitFor: {
      propDefinition: [
        webscrapingAI,
        "waitFor",
      ],
    },
    proxy: {
      propDefinition: [
        webscrapingAI,
        "proxy",
      ],
    },
    country: {
      propDefinition: [
        webscrapingAI,
        "country",
      ],
    },
    customProxy: {
      propDefinition: [
        webscrapingAI,
        "customProxy",
      ],
    },
    device: {
      propDefinition: [
        webscrapingAI,
        "device",
      ],
    },
    errorOn404: {
      propDefinition: [
        webscrapingAI,
        "errorOn404",
      ],
    },
    errorOnRedirect: {
      propDefinition: [
        webscrapingAI,
        "errorOnRedirect",
      ],
    },
    jsScript: {
      propDefinition: [
        webscrapingAI,
        "jsScript",
      ],
    },
    format: {
      propDefinition: [
        webscrapingAI,
        "format",
      ],
    },
    returnScriptResult: {
      type: "boolean",
      label: "Return Script Result",
      description: "Return result of the custom JavaScript code (`js_script` parameter) execution on the target page (`false` by default, page HTML will be returned).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.webscrapingAI.pageHtmlByUrl({
      $,
      params: {
        url: this.targetUrl,
        headers: utils.stringifyHeaders(this.headers),
        timeout: this.timeout,
        js: this.js,
        js_timeout: this.jsTimeout,
        wait_for: this.waitFor,
        proxy: this.proxy,
        country: this.country,
        custom_proxy: this.customProxy,
        device: this.device,
        error_on_404: this.errorOn404,
        error_on_redirect: this.errorOnRedirect,
        js_script: this.jsScript,
        format: this.format,
        return_script_result: this.returnScriptResult,
      },
    });
    $.export("$summary", `Successfully scraped HTML of URL ${this.targetUrl}`);
    return response;
  },
};
