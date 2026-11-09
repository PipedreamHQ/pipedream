import are_na from "../../are_na.app.mjs";

export default {
  key: "are_na-list-users",
  name: "List Users",
  description: "Lists Are.na users (including their IDs) that can be used for the User ID field of other actions. Returns `options` (the matching users, each with `id`, `slug` and `name` by default; pass **Fields** for more) and `meta` (pagination: `current_page`, `next_page`, `has_more_pages`, `total_count`). To get more users, call again with `page` set to `meta.next_page`. Premium Only: uses the Are.na search endpoint, which requires a Premium subscription. Example: query `*` with per 10 returns the first 10 users, e.g. `{ \"options\": [{ \"id\": 456, \"slug\": \"example\", \"name\": \"Example\" }], \"meta\": { \"next_page\": 2, \"total_count\": 87 } }`. [See the documentation](https://www.are.na/developers/explore/search/search)",
  version: "0.0.1",
  ai: "optimized",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    are_na,
    query: {
      type: "string",
      label: "Query",
      description: "Filter users by name or other content. Defaults to `*` (all users)",
      default: "*",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to return. Defaults to 1. Use `meta.next_page` from the previous response to get the next page",
      min: 1,
      default: 1,
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Fields to return for each result. Defaults to `id`, `slug` and `name`. Dot paths such as `owner.name` are supported",
      default: [
        "id",
        "slug",
        "name",
      ],
      optional: true,
    },
    per: {
      type: "integer",
      label: "Per Page",
      description: "Number of users per page (max 100). Defaults to 24",
      min: 1,
      max: 100,
      default: 24,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.are_na.search({
      $,
      params: {
        query: this.query || "*",
        type: "User",
        page: this.page,
        per: this.per,
      },
    });

    const options = this.are_na.pluckFields(response?.data, this.fields);

    $.export("$summary", `Successfully retrieved ${options.length} user${options.length === 1
      ? ""
      : "s"}`);
    return {
      options,
      meta: response?.meta,
    };
  },
};
