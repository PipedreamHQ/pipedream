import scrapeAutopilot from "../../scrape_autopilot.app.mjs";

const MAX_URLS = 10;
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
  name: "Scrape URLs",
  description: "Cost-efficiently scrape up to 10 public URLs and return one result per URL.",
  key: "scrape-ap-urls",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    scrapeAutopilot,
    urls: {
      type: "string[]",
      label: "URLs",
      description: "Public URLs to scrape. Maximum 10.",
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
    const urls = (this.urls || []).map((url) => url.trim()).filter(Boolean);

    if (!urls.length) {
      throw new Error("Provide at least one URL.");
    }

    if (urls.length > MAX_URLS) {
      throw new Error(`Scrape Autopilot batch scraping is limited to ${MAX_URLS} URLs.`);
    }

    const data = await this.scrapeAutopilot.request($, {
      method: "POST",
      path: "/api/scrape",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        urls,
        format: this.format || "md",
        js: Boolean(this.js),
      },
    });

    $.export(
      "$summary",
      `Scraped ${urls.length} URL${urls.length === 1
        ? ""
        : "s"}`,
    );
    return data;
  },
};
