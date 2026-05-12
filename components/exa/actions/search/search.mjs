import app from "../../exa.app.mjs";
import {
  buildExtrasConfig,
  buildHighlightsConfig,
  buildSummaryConfig,
  buildTextConfig,
  parseOptionalJsonSchema,
  validateAdditionalQueries,
  validateSearchCategoryConstraints,
} from "../../common/utils.mjs";

export default {
  key: "exa-search",
  name: "Search",
  description: "Search the web with Exa. `auto` is the recommended search type, and Highlights is the recommended default content mode. [See the documentation](https://docs.exa.ai/reference/search)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
    category: {
      propDefinition: [
        app,
        "category",
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
    systemPrompt: {
      propDefinition: [
        app,
        "systemPrompt",
      ],
    },
    outputSchema: {
      propDefinition: [
        app,
        "outputSchema",
      ],
    },
    additionalQueries: {
      propDefinition: [
        app,
        "additionalQueries",
      ],
    },
    userLocation: {
      propDefinition: [
        app,
        "userLocation",
      ],
    },
    contentsHighlights: {
      type: "boolean",
      label: "Contents - Highlights",
      description: "Return token-efficient highlights from each result. This is the recommended default for most Search workflows.",
      optional: true,
    },
    contentsHighlightQuery: {
      label: "Contents - Highlights Query",
      propDefinition: [
        app,
        "highlightsQuery",
      ],
    },
    contentsHighlightMaxCharacters: {
      label: "Contents - Highlights Max Characters",
      propDefinition: [
        app,
        "highlightsMaxCharacters",
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
      description: "Hidden legacy prop preserved for saved workflows. When set, Search preserves Exa's deprecated top-level context output and also keeps the legacy highlights fallback.",
      hidden: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const parsedOutputSchema = parseOptionalJsonSchema(this.outputSchema, "output schema");
    const parsedSummarySchema = parseOptionalJsonSchema(this.contentsSummarySchema, "summary schema");
    const hasExplicitTextConfig = this.contentsText !== undefined
      || this.contentsTextMaxCharacters !== undefined
      || this.contentsTextIncludeHtmlTags !== undefined
      || this.contentsTextVerbosity !== undefined
      || this.contentsTextIncludeSections !== undefined
      || this.contentsTextExcludeSections !== undefined;
    const hasExplicitSummaryConfig = this.contentsSummary !== undefined
      || this.contentsSummaryQuery !== undefined
      || this.contentsSummarySchema !== undefined;

    validateSearchCategoryConstraints({
      category: this.category,
      includeDomains: this.includeDomains,
      excludeDomains: this.excludeDomains,
      startCrawlDate: this.startCrawlDate,
      endCrawlDate: this.endCrawlDate,
      startPublishedDate: this.startPublishedDate,
      endPublishedDate: this.endPublishedDate,
    });
    validateAdditionalQueries(this.type, this.additionalQueries);

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
        enabled: this.contentsHighlights ?? (!hasExplicitTextConfig && !hasExplicitSummaryConfig
          ? true
          : undefined),
        query: this.contentsHighlightQuery,
        maxCharacters: this.contentsHighlightMaxCharacters,
        legacyEnabled: this.context === true,
      }),
      summary: buildSummaryConfig({
        enabled: this.contentsSummary,
        query: this.contentsSummaryQuery,
        schema: parsedSummarySchema,
      }),
      maxAgeHours: this.contentsMaxAgeHours,
      livecrawlTimeout: this.contentsLivecrawlTimeout,
      subpages: this.contentsSubpages,
      subpageTarget: this.contentsSubpageTarget,
      extras: buildExtrasConfig({
        links: this.contentsExtrasLinks,
        imageLinks: this.contentsExtrasImageLinks,
      }),
    };
    const hasContents = Object.values(contents).some((value) => value !== undefined);

    const data = {
      query: this.query,
      type: this.type,
      numResults: this.numResults,
      category: this.category,
      includeDomains: this.includeDomains,
      excludeDomains: this.excludeDomains,
      startCrawlDate: this.startCrawlDate,
      endCrawlDate: this.endCrawlDate,
      startPublishedDate: this.startPublishedDate,
      endPublishedDate: this.endPublishedDate,
      includeText: this.includeText,
      excludeText: this.excludeText,
      moderation: this.moderation,
      systemPrompt: this.systemPrompt,
      outputSchema: parsedOutputSchema,
      additionalQueries: this.additionalQueries,
      userLocation: this.userLocation,
      context: this.context,
      contents: hasContents
        ? contents
        : undefined,
    };

    const response = await this.app.search({
      $,
      data,
    });

    $.export("$summary", `Successfully performed search with ID \`${response.requestId}\`.`);
    return response;
  },
};
