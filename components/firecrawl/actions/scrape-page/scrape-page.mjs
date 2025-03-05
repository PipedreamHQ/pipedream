import { OUTPUT_FORMAT_OPTIONS } from "../../common/constants.mjs";
import { parseObjectEntries } from "../../common/utils.mjs";
import firecrawl from "../../firecrawl.app.mjs";

export default {
  key: "firecrawl-scrape-page",
  name: "Scrape Page",
  description:
    "Scrapes a URL and returns content from that page. [See the documentation](https://docs.firecrawl.dev/api-reference/endpoint/scrape)",
  version: "1.0.0",
  type: "action",
  props: {
    firecrawl,
    url: {
      propDefinition: [
        firecrawl,
        "url",
      ],
      description: "The URL to scrape",
    },
    formats: {
      type: "string[]",
      label: "Formats",
      description: "Formats to include in the output",
      options: OUTPUT_FORMAT_OPTIONS,
      optional: true,
    },
    onlyMainContent: {
      propDefinition: [
        firecrawl,
        "onlyMainContent",
      ],
    },
    includeTags: {
      type: "string[]",
      label: "Include Tags",
      description: "Tags to include in the output",
      optional: true,
    },
    excludeTags: {
      type: "string[]",
      label: "Exclude Tags",
      description: "Tags to exclude from the output",
      optional: true,
    },
    headers: {
      propDefinition: [
        firecrawl,
        "headers",
      ],
    },
    waitFor: {
      propDefinition: [
        firecrawl,
        "waitFor",
      ],
    },
    mobile: {
      type: "boolean",
      label: "Mobile",
      description: "Set to `true` to emulate scraping from a mobile device. Useful for testing responsive pages and taking mobile screenshots",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Timeout in milliseconds for the request",
      optional: true,
    },
    additionalOptions: {
      propDefinition: [
        firecrawl,
        "additionalOptions",
      ],
    },
  },
  async run({ $ }) {
    const {
      firecrawl, additionalOptions, ...data
    } = this;
    const response = await firecrawl.scrape({
      $,
      data: {
        ...data,
        ...(additionalOptions && parseObjectEntries(additionalOptions)),
      },
    });

    $.export("$summary", `Successfully scraped content from ${this.url}`);
    return response;
  },
};
