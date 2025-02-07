import webscrapingAI from "../../webscraping_ai.app.mjs";

export default {
  key: "webscraping_ai-scrape-website-text",
  name: "Scrape Website Text",
  description: "Returns the visible text content of a webpage specified by the URL. [See the documentation](https://webscraping.ai/docs#tag/Text/operation/getText).",
  version: "0.0.1",
  type: "action",
  props: {
    webscrapingAI,
    targetUrl: {
      propDefinition: [
        webscrapingAI,
        "targetUrl",
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
        text_format: this.textFormat,
        return_links: this.returnLinks,
      },
    });
    $.export("$summary", `Successfully scraped text from ${this.targetUrl}`);
    return response;
  },
};
