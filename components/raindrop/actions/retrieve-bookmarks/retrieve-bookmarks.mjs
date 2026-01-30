import raindrop from "../../raindrop.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "raindrop-retrieve-bookmarks",
  name: "Retrieve Bookmarks from Collection",
  description: "Retrieves all bookmarks from the specified collection. [See docs](https://developer.raindrop.io/v1/raindrops/multiple)",
  version: "0.2.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    raindrop,
    collectionId: {
      propDefinition: [
        raindrop,
        "collectionId",
      ],
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The way bookmarks should be sorted",
      optional: true,
      options: constants.SORT,
    },
    search: {
      type: "string",
      label: "Search",
      description: "A string for filtering the results. [See docs here](https://help.raindrop.io/using-search/#operators)",
      optional: true,
    },
  },
  async run({ $ }) {
    const bookmarks = [];
    const params = {
      sort: this.sort,
      search: this.search,
      perpage: constants.MAX_PER_PAGE,
      page: 0,
    };

    while (true) {
      const { items } = await this.raindrop.getRaindrops($, this.collectionId, params);
      bookmarks.push(...items);
      params.page++;

      if (items.length < constants.MAX_PER_PAGE) break;
    }

    $.export("$summary", `Retrieved ${bookmarks.length} bookmarks`);
    return bookmarks;
  },
};
