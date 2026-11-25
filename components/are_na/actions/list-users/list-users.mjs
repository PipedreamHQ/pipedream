import are_na from "../../are_na.app.mjs";
import utils from "../../common/utils.mjs";

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
      propDefinition: [
        are_na,
        "listQuery",
      ],
      description: "Filter users by name or other content. Defaults to `*` (all users)",
    },
    page: {
      propDefinition: [
        are_na,
        "page",
      ],
    },
    fields: {
      propDefinition: [
        are_na,
        "fields",
      ],
      description: "Fields to return for each user. Defaults to `id`, `slug` and `name`. Dot paths such as `owner.name` are supported",
      default: [
        "id",
        "slug",
        "name",
      ],
    },
    per: {
      propDefinition: [
        are_na,
        "per",
      ],
      description: "Number of users per page (max 100). Defaults to 24",
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

    const options = utils.pluckFields(response?.data ?? [], this.fields);

    $.export("$summary", `Successfully retrieved ${options.length} user${options.length === 1
      ? ""
      : "s"}`);
    return {
      options,
      meta: response?.meta,
    };
  },
};
