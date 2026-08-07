import superCarl from "../../super_carl.app.mjs";
import {
  cleanObject,
  countSummary,
  parseObjectProp,
  requireQueryOrFilters,
} from "../../common/utils.mjs";

export default {
  key: "super_carl-search-posts",
  name: "Search Posts",
  description: "Search Super Carl post and activity signals, including authored posts, comments, likes, reactions, company mentions, and engagement. Use this before **Search People** when the workflow is anchored on someone posting or engaging with content; enable With People to return deduped actors from matching activity. [See the documentation](https://supercarl.ai/docs/endpoints)",
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
    withPeople: {
      type: "boolean",
      label: "With People",
      description: "Include a deduped people set derived from matching post actors and authors.",
      optional: true,
      default: false,
    },
    previewLimit: {
      propDefinition: [
        superCarl,
        "previewLimit",
      ],
      description: "Maximum number of post or activity rows to return.",
      default: 10,
      max: 50,
    },
    offset: {
      propDefinition: [
        superCarl,
        "offset",
      ],
    },
    peopleLimit: {
      type: "integer",
      label: "People Limit",
      description: "Maximum deduped people to include when With People is enabled.",
      optional: true,
      default: 25,
      min: 1,
      max: 100,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort post rows by relevance, recency, or engagement.",
      optional: true,
      options: [
        "relevance",
        "recent",
        "engagement",
        "reactions",
        "comments",
      ],
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Sort direction for engagement, reactions, or comments ordering.",
      optional: true,
      options: [
        "asc",
        "desc",
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

    const response = await this.superCarl.searchPosts({
      $,
      withPeople: this.withPeople,
      data: cleanObject({
        query: this.query,
        filters,
        preview_limit: this.previewLimit,
        offset: this.offset,
        people_limit: this.withPeople
          ? this.peopleLimit
          : undefined,
        sort_by: this.sortBy,
        sort_order: this.sortOrder,
        delegate_user_id: this.delegateUserId,
      }),
    });

    $.export("$summary", countSummary({
      total: response?.total,
      rows: response?.results,
      rowLabel: "posts",
    }));
    return response;
  },
};
