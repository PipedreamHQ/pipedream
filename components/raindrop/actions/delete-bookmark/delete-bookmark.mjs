import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-delete-bookmark",
  name: "Delete Bookmark",
  description: "Delete a bookmark. [See the docs here](https://developer.raindrop.io/v1/raindrops/single#remove-raindrop)",
  version: "0.0.1",
  type: "action",
  props: {
    raindrop,
    bookmarkID: {
      propDefinition: [
        raindrop,
        "raindropID",
      ],
      label: "Bookmark ID",
      description: "Existing bookmark ID",
    },
  },
  async run({ $ }) {
    const bookmarkID = this.bookmarkID?.value ?? this.bookmarkID;

    return this.raindrop.deleteBookmark($, bookmarkID);
  },
};
