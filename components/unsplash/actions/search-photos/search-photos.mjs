import constants from "../../common/constants.mjs";
import app from "../../unsplash.app.mjs";

export default {
  key: "unsplash-search-photos",
  name: "Search Photos",
  description: "Get a single page of photo results for a query. [See the documentation](https://unsplash.com/documentation#search-photos)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "Search terms.",
    },
    contentFilter: {
      type: "string",
      label: "Content Filter",
      description: "Limit results by content safety. Valid values are `low` and `high`.",
      optional: true,
      options: constants.CONTENT_FILTERS,
    },
    color: {
      type: "string",
      label: "Color",
      description: "Filter results by color. Valid values are: `black_and_white`, `black`, `white`, `yellow`, `orange`, `red`, `purple`, `magenta`, `green`, `teal`, and `blue`.",
      optional: true,
      options: constants.COLOR_OPTIONS,
    },
    orientation: {
      type: "string",
      label: "Orientation",
      description: "Filter by photo orientation. Optional. (Valid values: `landscape`, `portrait`, `squarish`)",
      optional: true,
      options: constants.ORIENTATION_OPTIONS,
    },
  },
  methods: {
    searchPhotos(args = {}) {
      return this.app._makeRequest({
        path: "/search/photos",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      searchPhotos,
      query,
      contentFilter,
      color,
      orientation,
    } = this;

    const photos = await app.paginate({
      resourcesFn: searchPhotos,
      resourcesFnArgs: {
        $,
        params: {
          query,
          content_filter: contentFilter,
          color,
          orientation,
        },
      },
      resourceName: "results",
    });

    $.export("$summary", `Successfully retrieved \`${photos.length}\` photo(s).`);
    return photos;
  },
};
