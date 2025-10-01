import scrapegraphai from "../../scrapegraphai.app.mjs";

export default {
  key: "scrapegraphai-start-local-scraper",
  name: "Start Local Scraper",
  description: "Extract content from HTML content using AI by providing a natural language prompt and the HTML content. [See the documentation](https://docs.scrapegraphai.com/api-reference/endpoint/localscraper/start)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    scrapegraphai,
    html: {
      type: "string",
      label: "HTML",
      description: "The HTML to scrape",
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
    let response = await this.scrapegraphai.startLocalScraper({
      $,
      data: {
        website_html: this.html,
        user_prompt: this.prompt,
      },
    });

    if (this.waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      while (response.status !== "completed" && response.status !== "failed") {
        response = await this.scrapegraphai.getLocalScraperStatus({
          $,
          requestId: response.request_id,
        });
        await timer(3000);
      }
    }

    if (response.status !== "failed") {
      $.export("$summary", `Successfully ${this.waitForCompletion
        ? "completed"
        : "started" } scraping HTML.`);
    }
    return response;
  },
};
