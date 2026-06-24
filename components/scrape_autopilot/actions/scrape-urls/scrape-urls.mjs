import { ConfigurationError } from "@pipedream/platform";
import scrapeAutopilot from "../../scrape_autopilot.app.mjs";

const MAX_URLS = 10;

export default {
  name: "Scrape URLs",
  description: "Cost-efficiently scrape up to 10 public URLs and return one result per URL.",
  key: "scrape_autopilot-scrape-urls",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    const urls = (this.urls || []).map((url) => url.trim()).filter(Boolean);

    if (!urls.length) {
      throw new ConfigurationError("Provide at least one URL.");
    }

    if (urls.length > MAX_URLS) {
      throw new ConfigurationError(
        `Scrape Autopilot batch scraping is limited to ${MAX_URLS} URLs.`,
      );
    }

    const data = await this.scrapeAutopilot.scrapeUrls({
      $,
      urls,
      format: this.format,
      js: this.js,
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
