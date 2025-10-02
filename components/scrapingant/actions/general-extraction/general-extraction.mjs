import app from "../../scrapingant.app.mjs";

export default {
  key: "scrapingant-general-extraction",
  name: "General Extraction",
  description: "Send a request using the standard extraction method of ScrapingAnt. [See the documentation](https://docs.scrapingant.com/request-response-format)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      reloadProps: true,
    },
    returnPageSource: {
      propDefinition: [
        app,
        "returnPageSource",
      ],
      disabled: true,
      hidden: true,
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
      disabled: true,
      hidden: true,
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
      disabled: true,
      hidden: true,
    },
  },
  async additionalProps(existingProps) {
    const props = {};
    if (this.browser) {
      existingProps.returnPageSource.hidden = false;
      existingProps.returnPageSource.disabled = false;
      existingProps.jsSnippet.hidden = false;
      existingProps.jsSnippet.disabled = false;
      existingProps.blockResource.hidden = false;
      existingProps.blockResource.disabled = false;
    }

    return props;
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
