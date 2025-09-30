import harpaAi from "../../harpa_ai.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "harpa_ai-scrape-web-page",
  name: "Scrape Web Page",
  description: "Scrape a web page. [See the documentation](https://harpa.ai/grid/grid-rest-api-reference#web-page-scraping)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    harpaAi,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the web page to scrape",
    },
    grab: {
      type: "string[]",
      label: "Grab",
      description: "An array of HTML Element selectors to scrape from the page. Refer to the [Scraping Web Page Elements and Data](https://harpa.ai/grid/grid-rest-api-reference#scraping-web-page-elements-and-data) section for more details.",
      optional: true,
    },
    node: {
      propDefinition: [
        harpaAi,
        "node",
      ],
    },
    timeout: {
      propDefinition: [
        harpaAi,
        "timeout",
      ],
    },
    resultsWebhook: {
      propDefinition: [
        harpaAi,
        "resultsWebhook",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.harpaAi.sendAction({
      $,
      data: {
        action: "scrape",
        url: this.url,
        grab: parseObject(this.grab),
        node: this.node,
        timeout: this.timeout,
        resultsWebhook: this.resultsWebhook,
      },
    });
    $.export("$summary", `Scraped ${this.url}`);
    return response;
  },
};
