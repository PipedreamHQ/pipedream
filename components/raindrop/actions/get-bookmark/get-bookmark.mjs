import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-get-bookmark",
  name: "Get Bookmark",
  description: "Retrieve bookmark detailed information by given ID. [See the docs here](https://developer.raindrop.io/v1/raindrops/single#get-raindrop)",
  version: "0.0.6",
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
    const response = await this.raindrop.getRaindrop($, bookmarkId);
    $.export("$summary", `Successfully retrieved bookmark with ID ${bookmarkId}`);
    return response;
  },
};
