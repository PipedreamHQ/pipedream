import app from "../../zendesk.app.mjs";
import { toCommaSeparated } from "../../common/utils.mjs";

export default {
  key: "zendesk-search-articles",
  name: "Search Articles",
  description: "Searches Help Center articles. [See the documentation](https://developer.zendesk.com/api-reference/help_center/help-center-api/search/).",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    alert: {
      type: "alert",
      alertType: "warning",
      content: "At least one of **Query**, **Category**, **Section**, or **Label Names** must be provided.",
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "The search text to match (e.g. `carrot potato`). At least one of this, **Category**, **Section**, or **Label Names** must be provided.",
      optional: true,
    },
    locale: {
      propDefinition: [
        app,
        "locale",
      ],
      description: "Search for articles in the specified locale (e.g. `en-us`). Use `*` to search across all valid locales. Defaults to the Help Center's default locale if omitted or invalid.",
      optional: true,
    },
    articleCategoryId: {
      propDefinition: [
        app,
        "articleCategoryId",
      ],
      type: "string[]",
      label: "Category",
      description: "Limit results to articles in these categories. Accepts one or more category IDs.",
      optional: true,
    },
    sectionId: {
      propDefinition: [
        app,
        "sectionId",
      ],
      type: "string[]",
      label: "Section",
      description: "Limit results to articles in these sections. Accepts one or more section IDs.",
      optional: true,
    },
    labelNames: {
      propDefinition: [
        app,
        "labelName",
      ],
      type: "string[]",
      label: "Label Names",
      description: "Filter articles by label names. An article must have at least one of the labels to match. Matching is case-insensitive. Only available on Professional and Enterprise plans.",
    },
    brandId: {
      propDefinition: [
        app,
        "brandId",
      ],
      description: "Limit results to articles in the specified brand. If **Multibrand** is also set, results are still scoped to this brand.",
    },
    multibrand: {
      type: "boolean",
      label: "Multibrand",
      description: "If `true`, search returns results from all brands. If **Brand ID** is also set, results are scoped to that brand regardless of this setting.",
      optional: true,
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
      description: "Limit results to articles created before this date (format `YYYY-MM-DD`).",
      optional: true,
    },
    createdAfter: {
      type: "string",
      label: "Created After",
      description: "Limit results to articles created after this date (format `YYYY-MM-DD`).",
      optional: true,
    },
    createdAt: {
      type: "string",
      label: "Created At",
      description: "Limit results to articles created on this date (format `YYYY-MM-DD`).",
      optional: true,
    },
    updatedBefore: {
      type: "string",
      label: "Updated Before",
      description: "Limit results to articles updated before this date (format `YYYY-MM-DD`). Note: only content-meaningful updates are re-indexed.",
      optional: true,
    },
    updatedAfter: {
      type: "string",
      label: "Updated After",
      description: "Limit results to articles updated after this date (format `YYYY-MM-DD`). Note: only content-meaningful updates are re-indexed.",
      optional: true,
    },
    updatedAt: {
      type: "string",
      label: "Updated At",
      description: "Limit results to articles updated on this date (format `YYYY-MM-DD`).",
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
      description: "Page number to retrieve. Must be greater than 0. Default is 1.",
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
      locale,
      articleCategoryId,
      sectionId,
      labelNames,
      brandId,
      multibrand,
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

    const results = await this.app.searchArticles({
      step,
      customSubdomain,
      params: {
        query,
        locale,
        category: toCommaSeparated(articleCategoryId),
        section: toCommaSeparated(sectionId),
        label_names: toCommaSeparated(labelNames),
        brand_id: brandId,
        multibrand,
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

    step.export("$summary", `Successfully retrieved ${results.results?.length ?? 0} article(s)`);

    return results;
  },
};
