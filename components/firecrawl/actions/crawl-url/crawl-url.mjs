import firecrawl from "../../firecrawl.app.mjs";

export default {
  key: "firecrawl-crawl-url",
  name: "Crawl URL",
  description: "Crawls a given input URL and returns the contents of sub-pages. [See the documentation](https://docs.firecrawl.dev/api-reference/endpoint/crawl)",
  version: "0.0.1",
  type: "action",
  props: {
    firecrawl,
    url: {
      propDefinition: [
        firecrawl,
        "url",
      ],
    },
    includes: {
      propDefinition: [
        firecrawl,
        "includes",
      ],
      optional: true,
    },
    excludes: {
      propDefinition: [
        firecrawl,
        "excludes",
      ],
      optional: true,
    },
    generateImgAltText: {
      propDefinition: [
        firecrawl,
        "generateImgAltText",
      ],
      optional: true,
    },
    returnOnlyUrls: {
      propDefinition: [
        firecrawl,
        "returnOnlyUrls",
      ],
      optional: true,
    },
    maxDepth: {
      propDefinition: [
        firecrawl,
        "maxDepth",
      ],
      optional: true,
    },
    mode: {
      propDefinition: [
        firecrawl,
        "mode",
      ],
      optional: true,
    },
    ignoreSitemap: {
      propDefinition: [
        firecrawl,
        "ignoreSitemap",
      ],
      optional: true,
    },
    limit: {
      propDefinition: [
        firecrawl,
        "limit",
      ],
      optional: true,
    },
    allowBackwardCrawling: {
      propDefinition: [
        firecrawl,
        "allowBackwardCrawling",
      ],
      optional: true,
    },
    allowExternalContentLinks: {
      propDefinition: [
        firecrawl,
        "allowExternalContentLinks",
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
  },
  async run({ $ }) {
    const response = await this.firecrawl.crawl({
      $,
      data: {
        url: this.url,
        crawlerOptions: {
          includes: this.includes,
          excludes: this.excludes,
          generateImgAltText: this.generateImgAltText,
          returnOnlyUrls: this.returnOnlyUrls,
          maxDepth: parseInt(this.maxDepth),
          mode: this.mode,
          ignoreSitemap: this.ignoreSitemap,
          limit: this.limit,
          allowBackwardCrawling: this.allowBackwardCrawling,
          allowExternalContentLinks: this.allowExternalContentLinks,
        },
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
      },
    });

    $.export("$summary", `Crawl job started with jobId: ${response.jobId}`);
    return response;
  },
};
