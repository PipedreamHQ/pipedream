// x-pd-ai: optimized
import canva from "../../canva.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "canva-list-brand-templates",
  name: "List Brand Templates",
  description: "List brand templates available to the authenticated user via GET /brand-templates, with pagination and filters. [See the documentation](https://www.canva.dev/docs/connect/api-reference/brand-templates/list-brand-templates/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    canva,
    query: {
      type: "string",
      label: "Query",
      description: "Search term to filter brand templates by title.",
      optional: true,
    },
    ownership: {
      type: "string",
      label: "Ownership",
      description: "Filter by ownership. Valid values: `any`, `owned`, `shared`.",
      optional: true,
      options: constants.BRAND_TEMPLATE_OWNERSHIP_OPTIONS,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort order. Valid values: `relevance`, `modified_descending`, `modified_ascending`, `title_descending`, `title_ascending`.",
      optional: true,
      options: constants.BRAND_TEMPLATE_SORT_BY_OPTIONS,
    },
    dataset: {
      type: "string",
      label: "Dataset",
      description: "Filter by dataset presence. Valid values: `any`, `non_empty`.",
      optional: true,
      options: constants.BRAND_TEMPLATE_DATASET_OPTIONS,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Max number of templates to return per page. Between 1 and 100 (Canva API cap), default 25.",
      optional: true,
      default: 25,
      min: 1,
      max: 100,
    },
    continuation: {
      type: "string",
      label: "Continuation",
      description: "Continuation token from a previous response, to fetch the next page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.canva.listBrandTemplates({
      $,
      params: {
        query: this.query,
        ownership: this.ownership,
        sort_by: this.sortBy,
        dataset: this.dataset,
        limit: this.limit,
        continuation: this.continuation,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.items?.length ?? 0} brand template(s)`);
    return response;
  },
};
