import are_na from "../../are_na.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "are_na-list-groups",
  name: "List Groups",
  description: "Lists the Are.na groups the authenticated user owns or belongs to (including their IDs), for use in the Group ID field of other actions. Returns `options` (each group with `id`, `slug` and `name` by default; pass **Fields** for more) and `meta` (pagination: `current_page`, `next_page`, `has_more_pages`, `total_count`). To get more groups, call again with `page` set to `meta.next_page`. Only lists the user's own groups; it cannot find other groups by name. Example: per 10 returns up to 10 groups, e.g. `{ \"options\": [{ \"id\": 456, \"slug\": \"example\", \"name\": \"Example\" }], \"meta\": { \"next_page\": 2, \"total_count\": 12 } }`. [See the documentation](https://www.are.na/developers/explore/user/groups)",
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
    const response = await this.are_na.listOwnGroups({
      $,
      page: this.page,
      per: this.per,
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
