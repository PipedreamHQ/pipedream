// x-pd-ai: optimized
import superCarl from "../../super_carl.app.mjs";
import {
  applyFieldSelection,
  countSummary,
  parseObjectProp,
  requireQueryOrFilters,
} from "../../common/utils.mjs";

export default {
  key: "super_carl-search-companies",
  name: "Search Companies",
  description: "Search companies by name, domain, funding, size, industry, location, growth, or technology. Use this to qualify a target company or find companies matching structured Filters before reaching out. Use **Search People** afterward to find people at a matched company; enable Resolve Only to just disambiguate a single company name, domain, or LinkedIn URL without running a full search — Resolve Only returns identity metadata ONLY (name, domain, a coarse `employee_count`, `industries`), never a company's real size or description. When the task needs to know a company's actual size or what it does, leave Resolve Only off (or set it false) and set Result Mode to `detailed`; don't fill gaps from outside knowledge when Resolve Only comes back thin — re-call with `detailed` instead. Company rows in `detailed` mode can be large — pass Fields (e.g. `name`, `domain`, `employee_count`) to keep the result small. [See the documentation](https://supercarl.ai/docs#endpoints-companies)",
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
      description: "Return only company disambiguation metadata for a named company, domain, or LinkedIn company URL. Example query values: `stripe.com`, `https://www.linkedin.com/company/stripe`, or `Stripe`.",
      optional: true,
      default: false,
    },
    resultMode: {
      type: "string",
      label: "Result Mode",
      description: "Level of company-row detail to return. Use `preview` for fast, compact rows, or `detailed` when the workflow needs richer company metadata.",
      optional: true,
      default: "preview",
      options: [
        "preview",
        "detailed",
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
    fields: {
      propDefinition: [
        superCarl,
        "fields",
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
      data: {
        query: this.query,
        filters,
        preview_limit: this.previewLimit,
        resolve_only: this.resolveOnly,
        result_mode: this.resultMode,
        include_evidence_text: this.includeEvidenceText,
        delegate_user_id: this.delegateUserId,
      },
    });

    const total = response?.pagination?.total
      ?? response?.result_count
      ?? response?.result_count_estimate;

    $.export("$summary", countSummary({
      total,
      rows: response?.companies,
      rowLabel: "companies",
    }));

    return this.fields?.length
      ? {
        ...response,
        companies: applyFieldSelection(response?.companies, this.fields),
      }
      : response;
  },
};
