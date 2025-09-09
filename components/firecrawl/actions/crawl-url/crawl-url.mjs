import { parseObjectEntries } from "../../common/utils.mjs";
import firecrawl from "../../firecrawl.app.mjs";

export default {
  key: "firecrawl-crawl-url",
  name: "Crawl URL",
  description: "Crawls a given URL and returns the contents of sub-pages. [See the documentation](https://docs.firecrawl.dev/api-reference/endpoint/crawl-post)",
  version: "1.1.0",
  type: "action",
  props: {
    firecrawl,
    url: {
      propDefinition: [
        firecrawl,
        "url",
      ],
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "A prompt to use to generate the crawler options (all the parameters below) from natural language. Explicitly set parameters will override the generated equivalents.",
      optional: true,
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
    maxDiscoveryDepth: {
      type: "integer",
      label: "Max Discovery Depth",
      description: "Maximum depth to crawl based on discovery order. The root site and sitemapped pages has a discovery depth of 0. For example, if you set it to 1, and you set sitemap: 'skip', you will only crawl the entered URL and all URLs that are linked on that page.",
      optional: true,
    },
    sitemap: {
      type: "string",
      label: "Sitemap",
      description: "Sitemap mode when crawling. If you set it to 'skip', the crawler will ignore the website sitemap and only crawl the entered URL and discover pages from there onwards.",
      options: [
        "skip",
        "include",
      ],
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
    crawlEntireDomain: {
      type: "boolean",
      label: "Crawl Entire Domain",
      description: "Allows the crawler to follow internal links to sibling or parent URLs, not just child paths.",
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
