import are_na from "../../are_na.app.mjs";

export default {
  key: "are_na-list-channel-slug-options",
  name: "List Channel Slug Options",
  description: "Lists channels (slug and title) that can be used for the Channel Slug field of other actions. Returns `options` and `meta` (pagination: `current_page`, `next_page`, `has_more_pages`, `total_count`). To get more channels, call again with `page` set to `meta.next_page`. Premium Only: uses the Are.na search endpoint, which requires a Premium subscription. Example: query `*` with fields `[\"id\", \"slug\", \"title\"]` returns `{ \"options\": [{ \"id\": 12345, \"slug\": \"brutalist-architecture\", \"title\": \"Brutalist Architecture\" }], \"meta\": { \"next_page\": 2, \"total_count\": 40 } }`. [See the documentation](https://www.are.na/developers/explore/search/search)",
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
      type: "string",
      label: "Query",
      description: "Filter channels by title, description, or content. Defaults to `*` (all channels)",
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
      propDefinition: [
        are_na,
        "fields",
      ],
      description: "Only return these fields for each channel, e.g. `[\"id\", \"slug\", \"title\"]`. Pass this to keep the response small. Leave empty to return full channel objects",
    },
    per: {
      type: "integer",
      label: "Per Page",
      description: "Number of channels per page (max 100). Defaults to 24",
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
        type: "Channel",
        page: this.page,
        per: this.per,
      },
    });

    const options = this.are_na.pluckFields(response?.data, this.fields);

    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return {
      options,
      meta: response?.meta,
    };
  },
};
