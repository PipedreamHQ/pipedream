import { parseObjectEntries } from "../../common/utils.mjs";
import firecrawl from "../../firecrawl.app.mjs";

export default {
  key: "firecrawl-crawl-url",
  name: "Crawl URL",
  description: "Crawls a given URL and returns the contents of sub-pages. [See the documentation](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post)",
  version: "1.0.2",
  type: "action",
  props: {
    firecrawl,
    url: {
      propDefinition: [
        firecrawl,
        "url",
      ],
    },
    excludePaths: {
      type: "string[]",
      label: "Exclude Paths",
      description: "URL pathname regex patterns that exclude matching URLs from the crawl. For example, a value of `blog/.*` for the URL `firecrawl.dev` will exclude any results matching that pattern, such as `https://www.firecrawl.dev/blog/firecrawl-launch-week-1-recap`",
      optional: true,
    },
    includePaths: {
      type: "string[]",
      label: "Include Paths",
      description: "Similar to `Exclude Paths`, but if set, only the paths matching the specified patterns will be included",
      optional: true,
    },
    maxDepth: {
      type: "integer",
      label: "Max Depth",
      description: "Maximum depth to crawl relative to the entered URL",
      optional: true,
    },
    ignoreSitemap: {
      type: "boolean",
      label: "Ignore Sitemap",
      description: "Ignore the website sitemap when crawling",
      optional: true,
    },
    ignoreQueryParameters: {
      type: "boolean",
      label: "Ignore Query Parameters",
      description: "Do not re-scrape the same path with different (or none) query parameters",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of pages to crawl",
      optional: true,
    },
    allowBackwardLinks: {
      type: "boolean",
      label: "Allow Backward Links",
      description: "Enables the crawler to navigate from a specific URL to previously linked pages",
      optional: true,
    },
    allowExternalLinks: {
      type: "boolean",
      label: "Allow External Links",
      description: "Allows the crawler to follow links to external websites",
      optional: true,
    },
    additionalOptions: {
      propDefinition: [
        firecrawl,
        "additionalOptions",
      ],
      description: "Additional parameters to send in the request. [See the documentation](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post) for available parameters. Values will be parsed as JSON where applicable. For example, to add the `webhook` param, use the value `{\"webhook\": {\"url\": \"https://your-server-webhook-api.com\",\"headers\": {},\"metadata\": {},\"events\": [\"completed\"]}}`",
    },
  },
  async run({ $ }) {
    const {
      firecrawl, additionalOptions, ...data
    } = this;
    const response = await firecrawl.crawl({
      $,
      data: {
        ...data,
        ...(additionalOptions && parseObjectEntries(additionalOptions)),
      },
    });

    $.export("$summary", `Crawl job started (ID: ${response.id})`);
    return response;
  },
};
