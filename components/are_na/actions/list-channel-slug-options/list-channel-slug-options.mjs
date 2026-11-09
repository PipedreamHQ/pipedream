import are_na from "../../are_na.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "are_na-list-channel-slug-options",
  name: "List Channel Slug Options",
  description: "Lists channels that can be used for the Channel Slug field of other actions (each with `id`, `slug` and `title` by default; pass **Fields** for more). Returns `options` and `meta` (pagination: `current_page`, `next_page`, `has_more_pages`, `total_count`). To get more channels, call again with `page` set to `meta.next_page`. Premium Only: uses the Are.na search endpoint, which requires a Premium subscription. Example: query `*` returns `{ \"options\": [{ \"id\": 12345, \"slug\": \"brutalist-architecture\", \"title\": \"Brutalist Architecture\" }], \"meta\": { \"next_page\": 2, \"total_count\": 40 } }`. [See the documentation](https://www.are.na/developers/explore/search/search)",
  version: "0.1.0",
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
      description: "Filter channels by title, description, or content. Defaults to `*` (all channels)",
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
      description: "Fields to return for each channel. Defaults to `id`, `slug` and `title`. Dot paths such as `owner.name` are supported",
      default: [
        "id",
        "slug",
        "title",
      ],
    },
    per: {
      propDefinition: [
        are_na,
        "per",
      ],
      description: "Number of channels per page (max 100). Defaults to 24",
    },
  },
  async run({ $ }) {
    const response = await this.are_na.search({
      $,
      params: {
        query: this.query || "*",
        type: "Channel",
        page: this.page,
        per: this.per,
      },
    });

    const options = utils.pluckFields(response?.data ?? [], this.fields);

    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return {
      options,
      meta: response?.meta,
    };
  },
};
