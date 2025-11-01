import { ConfigurationError } from "@pipedream/platform";
import app from "../../exa.app.mjs";

export default {
  key: "exa-get-contents",
  name: "Get Contents",
  description: "Retrieves full page contents, summaries, and metadata for a list of URLs. Uses cached results with optional live crawling fallback. [See the documentation](https://docs.exa.ai/reference/get-contents)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    urls: {
      propDefinition: [
        app,
        "urls",
      ],
    },
    text: {
      description: "If `true`, returns full page text with default settings. If `false`, disables text return.",
      propDefinition: [
        app,
        "text",
      ],
    },
    highlightsNumSentences: {
      propDefinition: [
        app,
        "highlightsNumSentences",
      ],
    },
    highlightsPerUrl: {
      propDefinition: [
        app,
        "highlightsPerUrl",
      ],
    },
    highlightsQuery: {
      propDefinition: [
        app,
        "highlightsQuery",
      ],
    },
    summaryQuery: {
      propDefinition: [
        app,
        "summaryQuery",
      ],
    },
    summarySchema: {
      propDefinition: [
        app,
        "summarySchema",
      ],
    },
    livecrawl: {
      propDefinition: [
        app,
        "livecrawl",
      ],
    },
    livecrawlTimeout: {
      type: "integer",
      label: "Live Crawl Timeout",
      description: "Timeout in milliseconds for live crawling (default: 10000)",
      optional: true,
    },
    subpages: {
      propDefinition: [
        app,
        "subpages",
      ],
    },
    subpageTarget: {
      propDefinition: [
        app,
        "subpageTarget",
      ],
    },
    extrasLinks: {
      propDefinition: [
        app,
        "extrasLinks",
      ],
    },
    extrasImageLinks: {
      propDefinition: [
        app,
        "extrasImageLinks",
      ],
    },
    context: {
      description: "Return page contents as a context string for LLM. When true, combines all result contents into one string. We recommend using 10000+ characters for best results, though no limit works best. Context strings often perform better than highlights for RAG applications.",
      propDefinition: [
        app,
        "context",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      urls,
      text,
      highlightsNumSentences,
      highlightsPerUrl,
      highlightsQuery,
      summaryQuery,
      summarySchema,
      livecrawl,
      livecrawlTimeout,
      subpages,
      subpageTarget,
      extrasLinks,
      extrasImageLinks,
      context,
    } = this;

    let parsedSchema;
    if (summarySchema) {
      if (typeof summarySchema === "string") {
        try {
          parsedSchema = JSON.parse(summarySchema);
        } catch (error) {
          throw new ConfigurationError(`Invalid JSON schema format: ${error.message}. Please provide a valid JSON object.`);
        }
      } else {
        parsedSchema = summarySchema;
      }
    }

    const response = await app.getContents({
      $,
      data: {
        urls,
        text,
        livecrawl,
        livecrawlTimeout,
        subpages,
        subpageTarget,
        context,
        ...(extrasLinks
        || extrasImageLinks
          ? {
            extras: {
              links: extrasLinks,
              imageLinks: extrasImageLinks,
            },
          }
          : undefined
        ),
        ...(highlightsNumSentences
          || highlightsPerUrl
          || highlightsQuery
          ? {
            highlights: {
              numSentences: highlightsNumSentences,
              highlightsPerUrl,
              query: highlightsQuery,
            },
          }
          : undefined
        ),
        ...(summaryQuery
          || summarySchema
          ? {
            summary: {
              query: summaryQuery,
              schema: parsedSchema,
            },
          }
          : undefined
        ),
      },
    });

    $.export("$summary", `Successfully retrieved contents with ID \`${response.requestId}\`.`);
    return response;
  },
};
