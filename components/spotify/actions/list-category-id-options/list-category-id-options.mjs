import spotify from "../../spotify.app.mjs";

export default {
  key: "spotify-list-category-id-options",
  name: "List Category ID Options",
  description: "List Spotify browse categories, as `{ label, value }` options where `value` is the category ID (e.g. `party`)."
    + " Results are paginated 50 per page; `page` is zero-based, so call with `0`, then `1`, and so on until fewer than 50 options (or none) are returned."
    + " [See the documentation](https://developer.spotify.com/documentation/web-api/reference/get-categories)",
  version: "0.0.4",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    spotify,
    page: {
      type: "integer",
      label: "Page",
      description: "Zero-based page of results to retrieve (50 options per page). `0` returns the first page.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const response = await spotify.propDefinitions.categoryId.options.call(this.spotify, {
      page: this.page,
    });
    const { length } = response.options;
    $.export("$summary", `Successfully retrieved ${length} option${length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
