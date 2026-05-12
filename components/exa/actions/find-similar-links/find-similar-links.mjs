import app from "../../exa.app.mjs";
import {
  buildExtrasConfig,
  buildHighlightsConfig,
  buildSummaryConfig,
  buildTextConfig,
  parseOptionalJsonSchema,
  resolveFreshnessParams,
} from "../../common/utils.mjs";

export default {
  key: "exa-find-similar-links",
  name: "Find Similar Links",
  description: "Find pages similar to a seed URL with optional nested Exa content extraction. **This action is deprecated for new workflows. Prefer Search, optionally after Get Contents on the seed URL, for related-page discovery.** [See the documentation](https://docs.exa.ai/reference/find-similar-links)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    alert: {
      type: "alert",
      label: "Deprecation Notice",
      description: "Guidance for new workflows.",
      alertType: "warning",
      content: "This action is deprecated for new workflows. Prefer **Search** with a query derived from the seed page, optionally after **Get Contents** if you need to inspect the seed URL first.",
    },
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
    moderation: {
      propDefinition: [
        app,
        "moderation",
      ],
    },
    excludeSourceDomain: {
      propDefinition: [
        app,
        "excludeSourceDomain",
      ],
    },
    contentsText: {
      label: "Contents - Text",
      propDefinition: [
        app,
        "text",
      ],
    },
    contentsTextMaxCharacters: {
      label: "Contents - Text Max Characters",
      propDefinition: [
        app,
        "textMaxCharacters",
      ],
    },
    contentsTextIncludeHtmlTags: {
      label: "Contents - Text Include HTML Tags",
      propDefinition: [
        app,
        "textIncludeHtmlTags",
      ],
    },
    contentsTextVerbosity: {
      label: "Contents - Text Verbosity",
      propDefinition: [
        app,
        "textVerbosity",
      ],
    },
    contentsTextIncludeSections: {
      label: "Contents - Text Include Sections",
      propDefinition: [
        app,
        "textIncludeSections",
      ],
    },
    contentsTextExcludeSections: {
      label: "Contents - Text Exclude Sections",
      propDefinition: [
        app,
        "textExcludeSections",
      ],
    },
    contentsHighlights: {
      label: "Contents - Highlights",
      propDefinition: [
        app,
        "highlights",
      ],
    },
    contentsHighlightsQuery: {
      label: "Contents - Highlights Query",
      propDefinition: [
        app,
        "highlightsQuery",
      ],
    },
    contentsHighlightsMaxCharacters: {
      label: "Contents - Highlights Max Characters",
      propDefinition: [
        app,
        "highlightsMaxCharacters",
      ],
    },
    contentsSummary: {
      label: "Contents - Summary",
      propDefinition: [
        app,
        "summary",
      ],
    },
    contentsSummaryQuery: {
      label: "Contents - Summary Query",
      propDefinition: [
        app,
        "summaryQuery",
      ],
    },
    contentsSummarySchema: {
      label: "Contents - Summary Schema",
      propDefinition: [
        app,
        "summarySchema",
      ],
    },
    contentsMaxAgeHours: {
      label: "Contents - Max Age Hours",
      propDefinition: [
        app,
        "maxAgeHours",
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
      label: "Contents - Extras Links",
      propDefinition: [
        app,
        "extrasLinks",
      ],
    },
    contentsExtrasImageLinks: {
      label: "Contents - Extras Image Links",
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
    contentsContext: {
      type: "boolean",
      label: "Legacy Contents Context",
      description: "Hidden legacy prop preserved for saved workflows. Translates to highlights mode.",
      hidden: true,
      optional: true,
    },
    contentsHighlightsNumSentences: {
      type: "integer",
      label: "Legacy Contents Highlights Num Sentences",
      description: "Hidden legacy prop preserved for saved workflows. Enables modern highlights mode without forwarding deprecated fields.",
      hidden: true,
      optional: true,
    },
    contentsHighlightsPerUrl: {
      type: "integer",
      label: "Legacy Contents Highlights Per URL",
      description: "Hidden legacy prop preserved for saved workflows. Enables modern highlights mode without forwarding deprecated fields.",
      hidden: true,
      optional: true,
    },
    contentsLivecrawl: {
      type: "string",
      label: "Legacy Contents Live Crawl",
      description: "Hidden legacy prop preserved for saved workflows. Translates to modern freshness settings where possible.",
      hidden: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const parsedSummarySchema = parseOptionalJsonSchema(this.contentsSummarySchema, "summary schema");
    const freshness = resolveFreshnessParams({
      maxAgeHours: this.contentsMaxAgeHours,
      legacyLivecrawl: this.contentsLivecrawl,
    });

    const contents = {
      text: buildTextConfig({
        enabled: this.contentsText,
        maxCharacters: this.contentsTextMaxCharacters,
        includeHtmlTags: this.contentsTextIncludeHtmlTags,
        verbosity: this.contentsTextVerbosity,
        includeSections: this.contentsTextIncludeSections,
        excludeSections: this.contentsTextExcludeSections,
      }),
      highlights: buildHighlightsConfig({
        enabled: this.contentsHighlights,
        query: this.contentsHighlightsQuery,
        maxCharacters: this.contentsHighlightsMaxCharacters,
        legacyEnabled: this.context === true
          || this.contentsContext === true
          || this.contentsHighlightsNumSentences !== undefined
          || this.contentsHighlightsPerUrl !== undefined,
      }),
      summary: buildSummaryConfig({
        enabled: this.contentsSummary,
        query: this.contentsSummaryQuery,
        schema: parsedSummarySchema,
      }),
      livecrawlTimeout: this.contentsLivecrawlTimeout,
      subpages: this.contentsSubpages,
      subpageTarget: this.contentsSubpageTarget,
      extras: buildExtrasConfig({
        links: this.contentsExtrasLinks,
        imageLinks: this.contentsExtrasImageLinks,
      }),
      ...freshness,
    };
    const hasContents = Object.values(contents).some((value) => value !== undefined);

    const data = {
      url: this.url,
      numResults: this.numResults,
      includeDomains: this.includeDomains,
      excludeDomains: this.excludeDomains,
      excludeSourceDomain: this.excludeSourceDomain,
      startCrawlDate: this.startCrawlDate,
      endCrawlDate: this.endCrawlDate,
      startPublishedDate: this.startPublishedDate,
      endPublishedDate: this.endPublishedDate,
      includeText: this.includeText,
      excludeText: this.excludeText,
      moderation: this.moderation,
      contents: hasContents
        ? contents
        : undefined,
    };

    const response = await this.app.findSimilar({
      $,
      data,
    });

    $.export("$summary", `Successfully found similar links with ID \`${response.requestId}\`.`);
    return response;
  },
};
