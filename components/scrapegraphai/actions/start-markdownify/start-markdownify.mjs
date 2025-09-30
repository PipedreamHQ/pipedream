import scrapegraphai from "../../scrapegraphai.app.mjs";

export default {
  key: "scrapegraphai-start-markdownify",
  name: "Start Markdownify",
  description: "Convert any webpage into clean, readable Markdown format. [See the documentation](https://docs.scrapegraphai.com/api-reference/endpoint/markdownify/start)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    scrapegraphai,
    url: {
      propDefinition: [
        scrapegraphai,
        "url",
      ],
      description: "The URL of the website to convert into markdown",
    },
    waitForCompletion: {
      propDefinition: [
        scrapegraphai,
        "waitForCompletion",
      ],
    },
  },
  async run({ $ }) {
    let response = await this.scrapegraphai.startMarkdownify({
      $,
      data: {
        website_url: this.url,
      },
    });

    if (this.waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      while (response.status !== "completed" && response.status !== "failed") {
        response = await this.scrapegraphai.getMarkdownifyStatus({
          $,
          requestId: response.request_id,
        });
        await timer(3000);
      }
    }

    if (response.status !== "failed") {
      $.export("$summary", `Successfully ${this.waitForCompletion
        ? "completed"
        : "started" } converting ${this.url} to markdown.`);
    }
    return response;
  },
};
