import scrapegraphai from "../../scrapegraphai.app.mjs";

export default {
  key: "scrapegraphai-start-smart-scraper",
  name: "Start Smart Scraper",
  description: "Extract content from a webpage using AI by providing a natural language prompt and a URL. [See the documentation](https://docs.scrapegraphai.com/api-reference/endpoint/smartscraper/start).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    scrapegraphai,
    url: {
      propDefinition: [
        scrapegraphai,
        "url",
      ],
    },
    prompt: {
      propDefinition: [
        scrapegraphai,
        "prompt",
      ],
    },
    waitForCompletion: {
      propDefinition: [
        scrapegraphai,
        "waitForCompletion",
      ],
    },
  },
  async run({ $ }) {
    let response = await this.scrapegraphai.startSmartScraper({
      $,
      data: {
        website_url: this.url,
        user_prompt: this.prompt,
      },
    });

    if (this.waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      while (response.status !== "completed" && response.status !== "failed") {
        response = await this.scrapegraphai.getSmartScraperStatus({
          $,
          requestId: response.request_id,
        });
        await timer(3000);
      }
    }

    if (response.status !== "failed") {
      $.export("$summary", `Successfully ${this.waitForCompletion
        ? "completed"
        : "started" } scraping ${this.url}.`);
    }
    return response;
  },
};
