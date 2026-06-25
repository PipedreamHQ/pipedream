import superCarl from "../../super_carl.app.mjs";
import {
  cleanObject,
  countSummary,
  parseObjectProp,
  requireQueryOrFilters,
} from "../../common/utils.mjs";

export default {
  key: "super_carl-search-companies",
  name: "Search Companies",
  description: "Search companies by name, domain, funding, size, industry, location, growth, or technology. [See the documentation](https://supercarl.ai/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    superCarl,
    query: {
      propDefinition: [
        superCarl,
        "query",
      ],
    },
    filters: {
      propDefinition: [
        superCarl,
        "filters",
      ],
    },
    previewLimit: {
      propDefinition: [
        superCarl,
        "previewLimit",
      ],
    },
    resolveOnly: {
      type: "boolean",
      label: "Resolve Only",
      description: "Return only company disambiguation metadata for a named company, domain, or LinkedIn company URL.",
      optional: true,
      default: false,
    },
    resultMode: {
      type: "string",
      label: "Result Mode",
      description: "Level of company-row detail to return.",
      optional: true,
      default: "preview",
      options: [
        "preview",
        "detailed",
      ],
    },
    rankMode: {
      type: "string",
      label: "Rank Mode",
      description: "Optional ranking mode. `llm` uses a deeper retrieval pool and LLM reranking.",
      optional: true,
      options: [
        "default",
        "llm",
      ],
    },
    includeEvidenceText: {
      type: "boolean",
      label: "Include Evidence Text",
      description: "Include supporting evidence text on company rows when available.",
      optional: true,
      default: false,
    },
    delegateUserId: {
      propDefinition: [
        superCarl,
        "delegateUserId",
      ],
    },
  },
  async run({ $ }) {
    const filters = parseObjectProp(this.filters, "Filters");
    requireQueryOrFilters({
      query: this.query,
      filters,
    });

    const response = await this.superCarl.searchCompanies({
      $,
      data: cleanObject({
        query: this.query,
        filters,
        preview_limit: this.previewLimit,
        resolve_only: this.resolveOnly,
        result_mode: this.resultMode,
        rank_mode: this.rankMode === "default"
          ? undefined
          : this.rankMode,
        include_evidence_text: this.includeEvidenceText,
        delegate_user_id: this.delegateUserId,
      }),
    });

    const total = response?.pagination?.total
      ?? response?.result_count
      ?? response?.result_count_estimate;

    $.export("$summary", countSummary({
      total,
      rows: response?.companies,
      rowLabel: "companies",
    }));
    return response;
  },
};
