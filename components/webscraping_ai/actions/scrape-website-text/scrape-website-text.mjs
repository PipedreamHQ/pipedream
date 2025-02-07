import webscraping_ai from "../../webscraping_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "webscraping_ai-scrape-website-text",
  name: "Scrape Website Text",
  description: "Returns the visible text content of a webpage specified by the URL. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    webscraping_ai: {
      type: "app",
      app: "webscraping_ai",
    },
    targetUrl: {
      propDefinition: [
        webscraping_ai,
        "targetUrl",
      ],
    },
    textFormat: {
      propDefinition: [
        webscraping_ai,
        "textFormat",
      ],
      optional: true,
    },
    returnLinks: {
      propDefinition: [
        webscraping_ai,
        "returnLinks",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.webscraping_ai.getVisibleTextContent();
    $.export("$summary", `Successfully scraped text from ${this.targetUrl}`);
    return response;
  },
};
