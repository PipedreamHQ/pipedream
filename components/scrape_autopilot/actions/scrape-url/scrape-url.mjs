import scrapeAutopilot from "../../scrape_autopilot.app.mjs";

export default {
  name: "Scrape URL",
  description: "Cost-efficiently scrape one public URL and return Markdown, HTML, or text.",
  key: "scrape_autopilot-scrape-url",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    scrapeAutopilot,
    url: {
      type: "string",
      label: "URL",
      description: "The fully qualified public URL to scrape.",
    },
    format: {
      propDefinition: [
        scrapeAutopilot,
        "format",
      ],
    },
    js: {
      propDefinition: [
        scrapeAutopilot,
        "js",
      ],
    },
  },
  async run({ $ }) {
    const data = await this.scrapeAutopilot.scrapeUrl({
      $,
      url: this.url,
      format: this.format,
      js: this.js,
    });

    $.export("$summary", `Scraped ${this.url}`);
    return data;
  },
};
