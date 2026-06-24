import scrapeAutopilot from "../../scrape_autopilot.app.mjs";

const FORMATS = [
  {
    label: "Markdown",
    value: "md",
  },
  {
    label: "HTML",
    value: "html",
  },
  {
    label: "Text",
    value: "text",
  },
];

export default {
  name: "Scrape URL",
  description: "Cost-efficiently scrape one public URL and return Markdown, HTML, or text.",
  key: "scrape-ap-url",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      type: "string",
      label: "Output Format",
      description: "The response format to return.",
      options: FORMATS,
      optional: true,
      default: "md",
    },
    js: {
      type: "boolean",
      label: "Enable JavaScript Rendering",
      description: "Use JavaScript rendering for dynamic pages. This consumes more credits.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const data = await this.scrapeAutopilot.request($, {
      method: "POST",
      path: "/api/scrape",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        url: this.url,
        format: this.format || "md",
        js: Boolean(this.js),
      },
    });

    $.export("$summary", `Scraped ${this.url}`);
    return data;
  },
};
