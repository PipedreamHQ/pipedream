import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-get-collection",
  name: "Get Collection",
  description: "Get collection. [See the docs here](https://developer.raindrop.io/v1/collections/methods#get-collection)",
  version: "0.0.5",
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
  },
  async run({ $ }) {
    const collectionId = this.collectionId;
    const response = await this.raindrop.getCollection($, collectionId);
    $.export("$summary", `Successfully retrieved collection with ID ${collectionId}`);
    return response;
  },
};
