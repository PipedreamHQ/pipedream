import { ConfigurationError } from "@pipedream/platform";
import app from "../../tavily.app.mjs";
import constants from "../../common/constants.mjs";
import {
  validateList,
  validateRange,
} from "../../common/validation.mjs";

export default {
  key: "tavily-send-query",
  name: "Send Query",
  description: "Search the web with relevance, date, domain, and content controls. [See the documentation](https://docs.tavily.com/documentation/api-reference/endpoint/search)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    searchDepth: {
      propDefinition: [
        app,
        "searchDepth",
      ],
    },
    includeImages: {
      propDefinition: [
        app,
        "includeImages",
      ],
    },
    includeAnswer: {
      propDefinition: [
        app,
        "includeAnswer",
      ],
    },
    answerDepth: {
      type: "string",
      label: "Answer Depth",
      description: "When Include Answer is enabled, choose basic for a quick answer or advanced for a more detailed answer. Leave unset to preserve the standard answer behavior.",
      options: [
        "basic",
        "advanced",
      ],
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Maximum Results",
      description: "Maximum number of results to return, from 0 to 20. Leave unset to use the API default.",
      optional: true,
    },
    chunksPerSource: {
      type: "integer",
      label: "Chunks per Source",
      description: "Maximum relevant snippets per source, from 1 to 3. Applies to basic, advanced, and fast search depths.",
      optional: true,
    },
    topic: {
      type: "string",
      label: "Topic",
      description: "The category of the search",
      options: [
        "general",
        "news",
        "finance",
      ],
      optional: true,
    },
    timeRange: {
      type: "string",
      label: "Time Range",
      description: "Filter results by publication or last updated date relative to today",
      options: [
        "day",
        "week",
        "month",
        "year",
      ],
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Return results published or updated after this date, in YYYY-MM-DD format",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Return results published or updated before this date, in YYYY-MM-DD format",
      optional: true,
    },
    includeDomains: {
      type: "string[]",
      label: "Include Domains",
      description: "Domains to include in the search, up to 300. For example, docs.tavily.com.",
      optional: true,
    },
    excludeDomains: {
      type: "string[]",
      label: "Exclude Domains",
      description: "Domains to exclude from the search, up to 150",
      optional: true,
    },
    includeDomainsMode: {
      type: "string",
      label: "Include Domains Mode",
      description: "Requires Include Domains. Filter restricts results to those domains; boost also allows results from the rest of the web.",
      options: [
        "filter",
        "boost",
      ],
      optional: true,
    },
    includeRawContent: {
      type: "boolean",
      label: "Include Raw Content",
      description: "Include cleaned page content for each search result. This can increase response size and latency.",
      optional: true,
    },
    rawContentFormat: {
      type: "string",
      label: "Raw Content Format",
      description: "When Include Raw Content is enabled, select markdown or plain text. Leave unset for markdown.",
      options: constants.CONTENT_FORMATS,
      optional: true,
    },
    includeImageDescriptions: {
      type: "boolean",
      label: "Include Image Descriptions",
      description: "Add descriptions to images when Include Images is enabled",
      optional: true,
    },
    includeFavicon: {
      propDefinition: [
        app,
        "includeFavicon",
      ],
    },
    country: {
      type: "string",
      label: "Country",
      description: "Boost results from a country using its name, for example united states. Supported for the general topic only. See the API reference for accepted values.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Boost results in a language using its code or English name, for example en or english",
      optional: true,
    },
    filterByLanguage: {
      type: "boolean",
      label: "Filter by Language",
      description: "Strictly restrict results to the configured Language instead of only boosting them. Requires Language.",
      optional: true,
    },
    autoParameters: {
      type: "boolean",
      label: "Automatic Parameters",
      description: "Automatically choose search parameters from the query. Explicit values take precedence. May select advanced search (2 credits); set Search Depth explicitly to control cost.",
      optional: true,
    },
    exactMatch: {
      type: "boolean",
      label: "Exact Match",
      description: "Require exact matches for phrases enclosed in quotes in the query",
      optional: true,
    },
    safeSearch: {
      type: "boolean",
      label: "Safe Search",
      description: "Filter adult or unsafe content. Supported with basic and advanced search depths only.",
      optional: true,
    },
    includeUsage: {
      propDefinition: [
        app,
        "includeUsage",
      ],
    },
  },
  async run({ $ }) {
    validateRange(this.maxResults, "Maximum Results", 0, 20);
    validateRange(this.chunksPerSource, "Chunks per Source", 1, 3);
    validateList(this.includeDomains, "Include Domains", 0, 300);
    validateList(this.excludeDomains, "Exclude Domains", 0, 150);
    if (this.includeDomainsMode && !this.includeDomains?.length) {
      throw new ConfigurationError("Include Domains Mode requires at least one domain in Include Domains.");
    }
    if (this.filterByLanguage && !this.language?.trim()) {
      throw new ConfigurationError("Filter by Language requires Language.");
    }
    if (this.safeSearch && [
      "fast",
      "ultra-fast",
    ].includes(this.searchDepth)) {
      throw new ConfigurationError("Safe Search requires basic or advanced Search Depth.");
    }

    const response = await this.app.sendQuery({
      $,
      data: {
        query: this.query,
        search_depth: this.searchDepth,
        include_images: this.includeImages,
        include_answer: this.includeAnswer
          ? this.answerDepth ?? this.includeAnswer
          : this.includeAnswer,
        max_results: this.maxResults,
        chunks_per_source: this.chunksPerSource,
        topic: this.topic,
        time_range: this.timeRange,
        start_date: this.startDate,
        end_date: this.endDate,
        include_domains: this.includeDomains,
        exclude_domains: this.excludeDomains,
        include_domains_mode: this.includeDomainsMode,
        include_raw_content: this.includeRawContent
          ? this.rawContentFormat ?? this.includeRawContent
          : this.includeRawContent,
        include_image_descriptions: this.includeImageDescriptions,
        include_favicon: this.includeFavicon,
        country: this.country,
        language: this.language,
        filter_by_language: this.filterByLanguage,
        auto_parameters: this.autoParameters,
        exact_match: this.exactMatch,
        safe_search: this.safeSearch,
        include_usage: this.includeUsage,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.results?.length ?? 0} search results`);
    return response;
  },
};
