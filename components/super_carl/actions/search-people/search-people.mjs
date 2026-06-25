import superCarl from "../../super_carl.app.mjs";
import {
  cleanObject,
  countSummary,
  parseObjectProp,
  requireQueryOrFilters,
} from "../../common/utils.mjs";

export default {
  key: "super_carl-search-people",
  name: "Search People",
  description: "Search people by role, company history, expertise, location, network relationship, or recent activity. [See the documentation](https://supercarl.ai/docs)",
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
    preview: {
      type: "boolean",
      label: "Preview",
      description: "Use the fast preview route. Turn off for full rows with selected evidence detail.",
      optional: true,
      default: true,
    },
    limit: {
      propDefinition: [
        superCarl,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        superCarl,
        "offset",
      ],
    },
    evidenceFormat: {
      propDefinition: [
        superCarl,
        "evidenceFormat",
      ],
    },
    relationshipDetail: {
      propDefinition: [
        superCarl,
        "relationshipDetail",
      ],
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

    const response = await this.superCarl.searchPeople({
      $,
      preview: this.preview,
      data: cleanObject({
        query: this.query,
        filters,
        limit: this.limit,
        offset: this.offset,
        evidence_format: this.preview
          ? undefined
          : this.evidenceFormat,
        relationship_detail: this.relationshipDetail,
        delegate_user_id: this.delegateUserId,
      }),
    });

    $.export("$summary", countSummary({
      total: response?.total_count ?? response?.total,
      rows: response?.users,
      rowLabel: "people",
    }));
    return response;
  },
};
