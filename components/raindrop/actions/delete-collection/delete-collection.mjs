import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-delete-collection",
  name: "Delete Collection",
  description: "Delete a collection. [See the docs here](https://developer.raindrop.io/v1/collections/methods#remove-collection)",
  version: "0.0.6",
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
  },
  async run({ $ }) {
    const collectionId = this.collectionId;
    const response = await this.raindrop.deleteCollection($, collectionId);

    $.export("$summary", `Successfully deleted collection with ID ${collectionId}`);

    return response;
  },
};
