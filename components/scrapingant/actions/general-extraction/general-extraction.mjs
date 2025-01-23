import app from "../../scrapingant.app.mjs";

export default {
  key: "scrapingant-general-extraction",
  name: "General Extraction",
  description: "Send a request using the standard extraction method of ScrapingAnt.",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    browser: {
      propDefinition: [
        app,
        "browser",
      ],
    },
    returnPageSource: {
      propDefinition: [
        app,
        "returnPageSource",
      ],
    },
    cookies: {
      propDefinition: [
        app,
        "cookies",
      ],
    },
    jsSnippet: {
      propDefinition: [
        app,
        "jsSnippet",
      ],
    },
    proxyType: {
      propDefinition: [
        app,
        "proxyType",
      ],
    },
    proxyCountry: {
      propDefinition: [
        app,
        "proxyCountry",
      ],
    },
    waitForSelector: {
      propDefinition: [
        app,
        "waitForSelector",
      ],
    },
    blockResource: {
      propDefinition: [
        app,
        "blockResource",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.generalExtraction({
      $,
      params: {
        url: this.url,
        browser: this.browser,
        return_page_source: this.returnPageSource,
        cookies: this.cookies,
        js_snippet: this.jsSnippet,
        proxy_type: this.proxyType,
        proxy_country: this.proxyCountry,
        wait_for_selector: this.waitForSelector,
        block_resource: this.blockResource,
      },
    });

    $.export("$summary", "Successfully sent the request to ScrapingAnt");

    return response;
  },
};
