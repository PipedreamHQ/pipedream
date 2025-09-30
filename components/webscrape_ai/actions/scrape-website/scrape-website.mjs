import webscrapeAi from "../../webscrape_ai.app.mjs";

export default {
  key: "webscrape_ai-scrape-website",
  name: "Scrape Website",
  description: "Scrape the provided URL and store the results in the system. [See the documentation](https://webscrapeai.com/docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    webscrapeAi,
    alert: {
      type: "alert",
      alertType: "info",
      content: "This actions sends a synchronous request to the WebScrapeAI API and may require increasing the workflow's default timeout.",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the website to scrape",
    },
    command: {
      type: "string",
      label: "Command",
      description: "The data you want to extract. E.g. `I want to extract all the news details`",
    },
    schema: {
      type: "string",
      label: "Schema",
      description: "Schema representing the fields you want to scrape. E.g. `{\"author\":\"string\",\"comments_count\":\"integer\",\"points\":\"integer\",\"posted_time\":\"string\",\"title\":\"string\",\"url\":\"url\"}`",
    },
    pages: {
      type: "integer",
      label: "Pages",
      description: "Number of pages to scrape. Default value is 1.",
      optional: true,
    },
    headers: {
      type: "string",
      label: "Headers",
      description: "List of headers in key-value pairs. i.e `Accept: application/json`",
      optional: true,
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "List of JavaScript instructions that you want to execute, like clicking a specific button, waiting for a specific code block to appear, etc. Example: `{\"click\": \"#button_id\"}`. [See the documentation](https://webscrapeai.com/docs) for more information.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.webscrapeAi.scrapeWebsite({
      $,
      params: {
        url: this.url,
        command: this.command,
        schema: typeof this.schema === "object"
          ? JSON.stringify(this.schema)
          : this.schema,
        pages: this.pages,
        headers: this.headers,
        instructions: this.instructions,
      },
    });
    $.export("$summary", `Scraped ${this.url} and got ${response.length} result${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
