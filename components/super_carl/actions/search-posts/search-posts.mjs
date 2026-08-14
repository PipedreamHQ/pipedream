// x-pd-ai: optimized
import superCarl from "../../super_carl.app.mjs";
import {
  applyFieldSelection,
  countSummary,
  parseObjectProp,
  requireQueryOrFilters,
} from "../../common/utils.mjs";

export default {
  key: "super_carl-search-posts",
  name: "Search Posts",
  description: "Search Super Carl post and activity signals, including authored posts, comments, likes, reactions, company mentions, and engagement. Use this before **Search People** when the workflow is anchored on someone posting or engaging with content; enable With People to return deduped actors from matching activity. Post rows can be large — pass Fields (flat field names only, e.g. `author_name`, `text`, `url`; there is no nested `author.name` path) to keep the result small; With People's deduped rows are already trimmed and don't need Fields. [See the documentation](https://supercarl.ai/docs#endpoints-posts)",
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
      propDefinition: [
        superCarl,
        "withPeople",
      ],
      description: "Include a deduped people set derived from matching post actors and authors.",
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

    const response = await this.superCarl.searchPosts({
      $,
      withPeople: this.withPeople,
      data: {
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
      },
    });

    $.export("$summary", countSummary({
      total: response?.total,
      rows: response?.results,
      rowLabel: "posts",
    }));

    // Each deduped person carries its own `matched_posts` array (the posts
    // that matched, re-embedded per person) - consistently ~60% of that
    // row's size and redundant with `results`, which already has them.
    // Dropped unconditionally, not gated behind `fields` (which uses post
    // field names like `author_name` and wouldn't resolve against people's
    // own `name`/`headline` shape anyway).
    const people = Array.isArray(response?.people)
      ? response.people.map((person) => Object.fromEntries(
        Object.entries(person).filter(([
          key,
        ]) => key !== "matched_posts"),
      ))
      : response?.people;

    return this.fields?.length
      ? {
        ...response,
        results: applyFieldSelection(response?.results, this.fields),
        people,
      }
      : {
        ...response,
        people,
      };
  },
};
