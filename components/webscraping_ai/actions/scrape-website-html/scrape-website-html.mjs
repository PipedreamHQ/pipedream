import webscrapingAI from "../../webscraping_ai.app.mjs";

export default {
  key: "webscraping_ai-scrape-website-html",
  name: "Scrape Website HTML",
  description: "Returns the full HTML content of a webpage specified by the URL. [See the documentation](https://webscraping.ai/docs#tag/HTML/operation/getHTML):",
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
  },
  async run({ $ }) {
    const response = await this.webscrapingAI.pageHtmlByUrl({
      $,
      params: {
        url: this.targetUrl,
        format: "json",
      },
    });
    $.export("$summary", `Successfully scraped HTML of URL ${this.targetUrl}`);
    return response;
  },
};
