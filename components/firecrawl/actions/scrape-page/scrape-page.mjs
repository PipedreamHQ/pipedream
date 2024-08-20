import { parseObject } from "../../common/utils.mjs";
import firecrawl from "../../firecrawl.app.mjs";

export default {
  key: "firecrawl-scrape-page",
  name: "Scrape Page",
  description: "Scrapes a URL and returns content from that page. [See the documentation](https://docs.firecrawl.dev/api-reference/endpoint/scrape)",
  version: "0.0.1",
  type: "action",
  props: {
    firecrawl,
    url: {
      propDefinition: [
        firecrawl,
        "url",
      ],
      description: "The URL to start scraping from.",
    },
    extractorMode: {
      propDefinition: [
        firecrawl,
        "extractorMode",
      ],
      optional: true,
    },
    extractionPrompt: {
      propDefinition: [
        firecrawl,
        "extractionPrompt",
      ],
      optional: true,
    },
    extractionSchema: {
      propDefinition: [
        firecrawl,
        "extractionSchema",
      ],
      optional: true,
    },

    headers: {
      propDefinition: [
        firecrawl,
        "headers",
      ],
      optional: true,
    },
    includeHtml: {
      propDefinition: [
        firecrawl,
        "includeHtml",
      ],
      optional: true,
    },
    includeRawHtml: {
      propDefinition: [
        firecrawl,
        "includeRawHtml",
      ],
      optional: true,
    },
    onlyIncludeTags: {
      propDefinition: [
        firecrawl,
        "onlyIncludeTags",
      ],
      optional: true,
    },
    onlyMainContent: {
      propDefinition: [
        firecrawl,
        "onlyMainContent",
      ],
      optional: true,
    },
    removeTags: {
      propDefinition: [
        firecrawl,
        "removeTags",
      ],
      optional: true,
    },
    replaceAllPathsWithAbsolutePaths: {
      propDefinition: [
        firecrawl,
        "replaceAllPathsWithAbsolutePaths",
      ],
      optional: true,
    },
    screenshot: {
      propDefinition: [
        firecrawl,
        "screenshot",
      ],
      optional: true,
    },
    fullPageScreenshot: {
      propDefinition: [
        firecrawl,
        "fullPageScreenshot",
      ],
      optional: true,
    },
    waitFor: {
      propDefinition: [
        firecrawl,
        "waitFor",
      ],
      optional: true,
    },
    timeout: {
      propDefinition: [
        firecrawl,
        "timeout",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const extractorOptions = {};
    if (this.extractorMode) extractorOptions.extractorMode = this.extractorMode;
    if (this.extractionPrompt) extractorOptions.extractionPrompt = this.extractionPrompt;
    if (this.extractionSchema)
      extractorOptions.extractionSchema = parseObject(this.extractionSchema);

    const response = await this.firecrawl.scrape({
      $,
      data: {
        url: this.url,
        pageOptions: {
          headers: this.headers,
          includeHtml: this.includeHtml,
          includeRawHtml: this.includeRawHtml,
          onlyIncludeTags: this.onlyIncludeTags,
          onlyMainContent: this.onlyMainContent,
          removeTags: this.removeTags,
          replaceAllPathsWithAbsolutePaths: this.replaceAllPathsWithAbsolutePaths,
          screenshot: this.screenshot,
          fullPageScreenshot: this.fullPageScreenshot,
          waitFor: parseInt(this.waitFor),
        },
        extractorOptions,
        timeout: this.timeout,
      },
    });

    $.export("$summary", `Successfully scraped content from ${this.url}`);
    return response;
  },
};
