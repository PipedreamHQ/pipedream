import app from "../../capturekit.app.mjs";

export default {
  key: "capturekit-scrape-content",
  name: "Scrape Content",
  description: "Extract structured data from any webpage, including metadata, links, and raw HTML. [See the documentation](https://docs.capturekit.dev/api-reference/content-api)",
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
    includeHtml: {
      propDefinition: [
        app,
        "includeHtml",
      ],
    },
    useDefuddle: {
      propDefinition: [
        app,
        "useDefuddle",
      ],
    },
    selector: {
      propDefinition: [
        app,
        "selector",
      ],
    },
    removeSelectors: {
      propDefinition: [
        app,
        "removeSelectors",
      ],
    },
    blockUrls: {
      propDefinition: [
        app,
        "blockUrls",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.scrapeContent({
      $,
      params: {
        url: this.url,
        include_html: this.includeHtml,
        use_defuddle: this.useDefuddle,
        selector: this.selector,
        remove_selectors: (this.removeSelectors || []).join(","),
        block_urls: (this.blockUrls || []).join(","),
      },
    });
    $.export("$summary", "Successfully sent the Scrape Content request");
    return response;
  },
};
