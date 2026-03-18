import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-search-community-posts",
  name: "Search Community Posts",
  description: "Searches Help Center community posts. [See the documentation](https://developer.zendesk.com/api-reference/help_center/help-center-api/search/).",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      type: "string",
      label: "Search Query",
      description: "The search text to match (e.g. `carrot potato`).",
    },
    topicId: {
      propDefinition: [
        app,
        "topicId",
      ],
      description: "Limit results to posts in the specified community topic.",
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort results by `created_at` or `updated_at`. Defaults to sorting by relevance.",
      optional: true,
      options: [
        "created_at",
        "updated_at",
      ],
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Sort direction. Defaults to `desc`.",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    createdBefore: {
      type: "string",
      label: "Created Before",
      description: "Limit results to posts created before this date (format `YYYY-MM-DD`).",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Limit results to posts created after this date (format `YYYY-MM-DD`).",
      optional: true,
    },
    createdAt: {
      type: "string",
      label: "Created At",
      description: "Limit results to posts created on this date (format `YYYY-MM-DD`).",
      optional: true,
    },
    updatedBefore: {
      type: "string",
      label: "Updated Before",
      description: "Limit results to posts updated before this date (format `YYYY-MM-DD`).",
      optional: true,
    },
    updatedAfter: {
      type: "string",
      label: "Updated After",
      description: "Limit results to posts updated after this date (format `YYYY-MM-DD`).",
      optional: true,
    },
    updatedAt: {
      type: "string",
      label: "Updated At",
      description: "Limit results to posts updated on this date (format `YYYY-MM-DD`).",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Per Page",
      description: "Number of results per page. Between 1 and 100. Default is 25.",
      optional: true,
      default: 25,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to retrieve. Must be greater than 0. Offset pagination is limited to the first 100 pages (10,000 records) — requests beyond this will return a 400 error. Default is 1.",
      optional: true,
      default: 1,
    },
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
      ],
    },
  },
  async run({ $: step }) {
    const {
      query,
      topicId,
      sortBy,
      sortOrder,
      createdBefore,
      createdAfter,
      createdAt,
      updatedBefore,
      updatedAfter,
      updatedAt,
      limit,
      page,
      customSubdomain,
    } = this;

    const results = await this.app.searchCommunityPosts({
      step,
      customSubdomain,
      params: {
        query,
        topic: topicId,
        sort_by: sortBy,
        sort_order: sortOrder,
        created_before: createdBefore,
        created_after: createdAfter,
        created_at: createdAt,
        updated_before: updatedBefore,
        updated_after: updatedAfter,
        updated_at: updatedAt,
        per_page: limit,
        page,
      },
    });

    step.export("$summary", `Successfully retrieved ${results.results?.length ?? 0} community post(s)`);

    return results;
  },
};
