import { ConfigurationError } from "@pipedream/platform";
import app from "../../exa.app.mjs";

export default {
  key: "exa-find-similar-links",
  name: "Find Similar Links",
  description: "Identifies and retrieves web pages similar to a provided URL with optional content extraction. [See the documentation](https://docs.exa.ai/reference/find-similar-links)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    numResults: {
      propDefinition: [
        app,
        "numResults",
      ],
    },
    includeDomains: {
      propDefinition: [
        app,
        "includeDomains",
      ],
    },
    excludeDomains: {
      propDefinition: [
        app,
        "excludeDomains",
      ],
    },
    startCrawlDate: {
      propDefinition: [
        app,
        "startCrawlDate",
      ],
    },
    endCrawlDate: {
      propDefinition: [
        app,
        "endCrawlDate",
      ],
    },
    startPublishedDate: {
      propDefinition: [
        app,
        "startPublishedDate",
      ],
    },
    endPublishedDate: {
      propDefinition: [
        app,
        "endPublishedDate",
      ],
    },
    includeText: {
      propDefinition: [
        app,
        "includeText",
      ],
    },
    excludeText: {
      propDefinition: [
        app,
        "excludeText",
      ],
    },
    context: {
      propDefinition: [
        app,
        "context",
      ],
    },
    moderation: {
      propDefinition: [
        app,
        "moderation",
      ],
    },
    contentsText: {
      label: "Contents - Text",
      propDefinition: [
        app,
        "text",
      ],
    },
    contentsHighlightsNumSentences: {
      label: "Contents - Highlights - Number of Sentences",
      propDefinition: [
        app,
        "highlightsNumSentences",
      ],
    },
    contentsHighlightsPerUrl: {
      label: "Contents - Highlights - Number of Snippets per URL",
      propDefinition: [
        app,
        "highlightsPerUrl",
      ],
    },
    contentsHighlightsQuery: {
      label: "Contents - Highlights - Custom Query",
      propDefinition: [
        app,
        "highlightsQuery",
      ],
    },
    contentsSummaryQuery: {
      label: "Contents - Summary - Custom Query",
      propDefinition: [
        app,
        "summaryQuery",
      ],
    },
    contentsSummarySchema: {
      label: "Contents - Summary - JSON Schema",
      propDefinition: [
        app,
        "summarySchema",
      ],
    },
    contentsLivecrawl: {
      label: "Contents - Live Crawl",
      propDefinition: [
        app,
        "livecrawl",
      ],
    },
    contentsLivecrawlTimeout: {
      label: "Contents - Live Crawl Timeout",
      propDefinition: [
        app,
        "livecrawlTimeout",
      ],
    },
    contentsSubpages: {
      label: "Contents - Subpages",
      propDefinition: [
        app,
        "subpages",
      ],
    },
    contentsSubpageTarget: {
      label: "Contents - Subpage Target",
      propDefinition: [
        app,
        "subpageTarget",
      ],
    },
    contentsExtrasLinks: {
      label: "Contents - Extras - Number of Links",
      propDefinition: [
        app,
        "extrasLinks",
      ],
    },
    contentsExtrasImageLinks: {
      label: "Contents - Extras - Number of Image Links",
      propDefinition: [
        app,
        "extrasImageLinks",
      ],
    },
    contentsContext: {
      label: "Contents - Context",
      propDefinition: [
        app,
        "context",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      url,
      numResults,
      includeDomains,
      excludeDomains,
      startCrawlDate,
      endCrawlDate,
      startPublishedDate,
      endPublishedDate,
      includeText,
      excludeText,
      contentsText,
      contentsHighlightsNumSentences,
      contentsHighlightsPerUrl,
      contentsHighlightsQuery,
      contentsSummaryQuery,
      contentsSummarySchema,
      contentsLivecrawl,
      contentsLivecrawlTimeout,
      contentsSubpages,
      contentsSubpageTarget,
      contentsExtrasLinks,
      contentsExtrasImageLinks,
      contentsContext,
    } = this;

    const highlights = contentsHighlightsNumSentences
      || contentsHighlightsPerUrl
      || contentsHighlightsQuery
      ? {
        numSentences: contentsHighlightsNumSentences,
        highlightsPerUrl: contentsHighlightsPerUrl,
        query: contentsHighlightsQuery,
      }
      : undefined;

    let parsedSchema;
    if (contentsSummarySchema) {
      if (typeof contentsSummarySchema === "string") {
        try {
          parsedSchema = JSON.parse(contentsSummarySchema);
        } catch (error) {
          throw new ConfigurationError(`Invalid JSON schema format: ${error.message}. Please provide a valid JSON object.`);
        }
      } else {
        parsedSchema = contentsSummarySchema;
      }
    }

    const summary = contentsSummaryQuery
      || contentsSummarySchema
      ? {
        query: contentsSummaryQuery,
        schema: parsedSchema,
      }
      : undefined;

    const extras = contentsExtrasLinks
      || contentsExtrasImageLinks
      ? {
        links: contentsExtrasLinks,
        imageLinks: contentsExtrasImageLinks,
      }
      : undefined;

    const response = await app.findSimilar({
      $,
      data: {
        url,
        numResults,
        includeDomains,
        excludeDomains,
        startCrawlDate,
        endCrawlDate,
        startPublishedDate,
        endPublishedDate,
        includeText,
        excludeText,
        ...(contentsText
          || contentsLivecrawl
          || contentsLivecrawlTimeout
          || contentsSubpages
          || contentsSubpageTarget
          || contentsContext
          || highlights
          || summary
          || extras
          ? {
            contents: {
              text: contentsText,
              context: contentsContext,
              highlights,
              summary,
              livecrawl: contentsLivecrawl,
              livecrawlTimeout: contentsLivecrawlTimeout,
              subpages: contentsSubpages,
              subpageTarget: contentsSubpageTarget,
              extras,
            },
          }
          : undefined
        ),
      },
    });

    $.export("$summary", `Successfully found similar links with ID \`${response.requestId}\`.`);
    return response;
  },
};
