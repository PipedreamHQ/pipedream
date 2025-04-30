import pexels from "../../pexels.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pexels-search-photos",
  name: "Search Photos",
  description: "Search for photos on Pexels using a keyword or phrase. [See the documentation](https://www.pexels.com/api/documentation/)",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    const response = await this.pexels.searchPhotos({
      query: this.searchQuery,
      orientation: this.orientation,
      size: this.size,
      color: this.color,
    });

    $.export("$summary", `Successfully retrieved ${response.photos.length} photos for the query "${this.searchQuery}".`);
    return response;
  },
};
