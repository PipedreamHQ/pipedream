import { ConfigurationError } from "@pipedream/platform";
import app from "../../exa.app.mjs";
import {
  buildExtrasConfig,
  buildHighlightsConfig,
  buildSummaryConfig,
  buildTextConfig,
  omitUndefinedValues,
  parseOptionalJsonSchema,
  resolveFreshnessParams,
} from "../../common/utils.mjs";

export default {
  key: "exa-get-contents",
  name: "Get Contents",
  description: "Retrieve clean text, highlights, summaries, and metadata for specific URLs or Exa document IDs. Highlights are the recommended default extraction mode for most workflows. [See the documentation](https://docs.exa.ai/reference/get-contents)",
  version: "0.1.0",
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
      optional: true,
    },
    ids: {
      propDefinition: [
        app,
        "ids",
      ],
    },
    text: {
      label: "Text",
      description: "Return full page text. Prefer Highlights when you only need targeted excerpts.",
      propDefinition: [
        app,
        "text",
      ],
    },
    textMaxCharacters: {
      propDefinition: [
        app,
        "textMaxCharacters",
      ],
    },
    textIncludeHtmlTags: {
      propDefinition: [
        app,
        "textIncludeHtmlTags",
      ],
    },
    textVerbosity: {
      propDefinition: [
        app,
        "textVerbosity",
      ],
    },
    textIncludeSections: {
      propDefinition: [
        app,
        "textIncludeSections",
      ],
    },
    textExcludeSections: {
      propDefinition: [
        app,
        "textExcludeSections",
      ],
    },
    highlights: {
      propDefinition: [
        app,
        "highlights",
      ],
    },
    highlightsQuery: {
      propDefinition: [
        app,
        "highlightsQuery",
      ],
    },
    highlightsMaxCharacters: {
      propDefinition: [
        app,
        "highlightsMaxCharacters",
      ],
    },
    summary: {
      propDefinition: [
        app,
        "summary",
      ],
    },
    summaryQuery: {
      label: "Summary Query",
      description: "Optional instructions that guide Exa's generated summary. Prefer Highlights unless you explicitly need Exa-side synthesis.",
      propDefinition: [
        app,
        "summaryQuery",
      ],
    },
    summarySchema: {
      label: "Summary Schema",
      description: "Optional JSON schema for structured Exa-side summaries.",
      propDefinition: [
        app,
        "summarySchema",
      ],
    },
    maxAgeHours: {
      propDefinition: [
        app,
        "maxAgeHours",
      ],
    },
    livecrawlTimeout: {
      propDefinition: [
        app,
        "livecrawlTimeout",
      ],
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
      type: "boolean",
      label: "Legacy Context",
      description: "Hidden legacy prop preserved for saved workflows. Translates to highlights mode.",
      hidden: true,
      optional: true,
    },
    highlightsNumSentences: {
      type: "integer",
      label: "Legacy Highlights Num Sentences",
      description: "Hidden legacy prop preserved for saved workflows. Enables modern highlights mode without forwarding deprecated fields.",
      hidden: true,
      optional: true,
    },
    highlightsPerUrl: {
      type: "integer",
      label: "Legacy Highlights Per URL",
      description: "Hidden legacy prop preserved for saved workflows. Enables modern highlights mode without forwarding deprecated fields.",
      hidden: true,
      optional: true,
    },
    livecrawl: {
      type: "string",
      label: "Legacy Live Crawl",
      description: "Hidden legacy prop preserved for saved workflows. Translates to modern freshness settings where possible.",
      hidden: true,
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.urls?.length && this.ids?.length) {
      throw new ConfigurationError("Provide either URLs or IDs, but not both.");
    }

    if (!this.urls?.length && !this.ids?.length) {
      throw new ConfigurationError("Provide URLs or IDs.");
    }

    const parsedSummarySchema = parseOptionalJsonSchema(this.summarySchema, "summary schema");
    const freshness = resolveFreshnessParams({
      maxAgeHours: this.maxAgeHours,
      legacyLivecrawl: this.livecrawl,
    });

    const data = omitUndefinedValues({
      urls: this.urls?.length
        ? this.urls
        : undefined,
      ids: this.ids?.length
        ? this.ids
        : undefined,
      text: buildTextConfig({
        enabled: this.text,
        maxCharacters: this.textMaxCharacters,
        includeHtmlTags: this.textIncludeHtmlTags,
        verbosity: this.textVerbosity,
        includeSections: this.textIncludeSections,
        excludeSections: this.textExcludeSections,
      }),
      highlights: buildHighlightsConfig({
        enabled: this.highlights,
        query: this.highlightsQuery,
        maxCharacters: this.highlightsMaxCharacters,
        legacyEnabled: this.context === true
          || this.highlightsNumSentences !== undefined
          || this.highlightsPerUrl !== undefined,
      }),
      summary: buildSummaryConfig({
        enabled: this.summary,
        query: this.summaryQuery,
        schema: parsedSummarySchema,
      }),
      livecrawlTimeout: this.livecrawlTimeout,
      subpages: this.subpages,
      subpageTarget: this.subpageTarget,
      extras: buildExtrasConfig({
        links: this.extrasLinks,
        imageLinks: this.extrasImageLinks,
      }),
      ...freshness,
    });

    const response = await this.app.getContents({
      $,
      data,
    });

    $.export("$summary", `Successfully retrieved contents with ID \`${response.requestId}\`.`);
    return response;
  },
};
