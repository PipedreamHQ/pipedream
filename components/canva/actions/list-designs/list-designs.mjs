import canva from "../../canva.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "canva-list-designs",
  name: "List Designs",
  description: "List all designs in Canva. [See the documentation](https://www.canva.dev/docs/connect/api-reference/designs/list-designs/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    canva,
    query: {
      type: "string",
      label: "Query",
      description: "Keyword or phrase to search across designs owned by or shared with the user. Maximum 255 characters. Example: `\"Q4 marketing banner\"`",
      optional: true,
    },
    continuation: {
      type: "string",
      label: "Continuation",
      description: "Pagination cursor returned in a previous response. Pass this value to retrieve the next page of results. Leave blank to start from the beginning. Example: `\"eyJhbGciOiJIUzI1NiJ9...\"`",
      optional: true,
    },
    ownership: {
      type: "string",
      label: "Ownership",
      description: "Filter designs by ownership. Use `owned` to see only designs you created, `shared` to see only designs others shared with you, or `any` to see both. Example: `\"owned\"`",
      optional: true,
      default: "any",
      options: constants.OWNERSHIP_OPTIONS,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Order of the returned designs. Use `relevance` when searching by query, or a date/title option to browse all designs. Example: `\"modified_descending\"`",
      optional: true,
      default: "relevance",
      options: constants.SORT_BY_OPTIONS,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of designs to return per request (1–100). Use with `Continuation` to page through large result sets. Example: `25`",
      optional: true,
      default: 25,
      min: 1,
      max: 100,
    },
  },
  async run({ $ }) {
    const designs = await this.canva.listDesigns({
      $,
      params: {
        query: this.query?.length
          ? this.query.slice(0, 255)
          : undefined,
        continuation: this.continuation,
        ownership: this.ownership ?? "any",
        sort_by: this.sortBy ?? "relevance",
        limit: this.limit ?? 25,
      },
    });
    $.export("$summary", `Successfully retrieved ${designs.items?.length} design${designs.items?.length === 1
      ? ""
      : "s"}`);
    return designs;
  },
};
