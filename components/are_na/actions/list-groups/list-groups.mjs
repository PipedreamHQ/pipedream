import are_na from "../../are_na.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "are_na-list-groups",
  name: "List Groups",
  description: "Lists Are.na groups (including their IDs) that can be used for the Group ID field of other actions. Returns `options` (the matching groups, each with `id`, `slug` and `name` by default; pass **Fields** for more) and `meta` (pagination: `current_page`, `next_page`, `has_more_pages`, `total_count`). To get more groups, call again with `page` set to `meta.next_page`. Premium Only: uses the Are.na search endpoint, which requires a Premium subscription. Example: query `*` with per 10 returns the first 10 groups, e.g. `{ \"options\": [{ \"id\": 456, \"slug\": \"example\", \"name\": \"Example\" }], \"meta\": { \"next_page\": 2, \"total_count\": 87 } }`. [See the documentation](https://www.are.na/developers/explore/search/search)",
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
      description: "Filter groups by name or other content. Defaults to `*` (all groups)",
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
      description: "Fields to return for each group. Defaults to `id`, `slug` and `name`. Dot paths such as `owner.name` are supported",
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
      description: "Number of groups per page (max 100). Defaults to 24",
    },
  },
  async run({ $ }) {
    const response = await this.are_na.search({
      $,
      params: {
        query: this.query || "*",
        type: "Group",
        page: this.page,
        per: this.per,
      },
    });

    const options = utils.pluckFields(response?.data ?? [], this.fields);

    $.export("$summary", `Successfully retrieved ${options.length} group${options.length === 1
      ? ""
      : "s"}`);
    return {
      options,
      meta: response?.meta,
    };
  },
};
