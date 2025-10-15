import webscrapingAI from "../../webscraping_ai.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "webscraping_ai-scrape-website-text",
  name: "Scrape Website Text",
  description: "Returns the visible text content of a webpage specified by the URL. [See the documentation](https://webscraping.ai/docs#tag/Text/operation/getText).",
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
    textFormat: {
      type: "string",
      label: "Text Format",
      description: "The format of the returned text content. Default: `json`",
      options: [
        "plain",
        "xml",
        "json",
      ],
      default: "json",
      optional: true,
    },
    returnLinks: {
      type: "boolean",
      label: "Return Links",
      description: "Whether to include links in the returned text content. Works only when Text Format is `json`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.webscrapingAI.pageTextByUrl({
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
        text_format: this.textFormat,
        return_links: this.returnLinks,
      },
    });
    $.export("$summary", `Successfully scraped text from ${this.targetUrl}`);
    return response;
  },
};
