import pexels from "../../pexels.app.mjs";

export default {
  key: "pexels-search-photos",
  name: "Search Photos",
  description: "Search for photos on Pexels using a keyword or phrase. [See the documentation](https://www.pexels.com/api/documentation/#photos-search)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pexels,
    searchQuery: {
      propDefinition: [
        pexels,
        "searchQuery",
      ],
    },
    orientation: {
      propDefinition: [
        pexels,
        "orientation",
      ],
    },
    size: {
      propDefinition: [
        pexels,
        "size",
      ],
    },
    color: {
      propDefinition: [
        pexels,
        "color",
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number you are requesting",
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "The number of results you are requesting per page",
      max: 80,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pexels.searchPhotos({
      $,
      params: {
        query: this.searchQuery,
        orientation: this.orientation,
        size: this.size,
        color: this.color,
        page: this.page || 1,
        per_page: this.perPage || 15,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.photos.length} photos for the query "${this.searchQuery}".`);
    return response;
  },
};
