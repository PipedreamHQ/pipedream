import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-delete-bookmark",
  name: "Delete Bookmark",
  description: "Delete a bookmark. [See the docs here](https://developer.raindrop.io/v1/raindrops/single#remove-raindrop)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    bookmarkId: {
      propDefinition: [
        raindrop,
        "raindropId",
        (c) => ({
          collectionId: c.collectionId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const bookmarkId = this.bookmarkId;
    const response = await this.raindrop.deleteBookmark($, bookmarkId);

    $.export("$summary", `Successfully deleted bookmark with ID ${bookmarkId}`);

    return response;
  },
};
