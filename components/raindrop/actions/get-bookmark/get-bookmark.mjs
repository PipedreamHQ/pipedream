import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-get-bookmark",
  name: "Get Bookmark",
  description: "Retrieve bookmark detailed information by given ID. [See the docs here](https://developer.raindrop.io/v1/raindrops/single#get-raindrop)",
  version: "0.0.1",
  type: "action",
  props: {
    raindrop,
    // We call bookmarks (or items) as "raindrops" [https://developer.raindrop.io/v1/raindrops]
    bookmarkID: {
      propDefinition: [
        raindrop,
        "raindropID",
      ],
      label: "Bookmark ID",
      description: "Existing bookmark ID",
    },
  },
  async run() {
    const bookmarkID = this.bookmarkID?.value ?? this.bookmarkID;

    return this.raindrop.getRaindrop(bookmarkID);
  },
};
