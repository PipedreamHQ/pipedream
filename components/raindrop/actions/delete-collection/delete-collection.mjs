import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-delete-collection",
  name: "Delete Collection",
  description: "Delete a collection. [See the docs here](https://developer.raindrop.io/v1/collections/methods#remove-collection)",
  version: "0.0.1",
  type: "action",
  props: {
    raindrop,
    collectionID: {
      propDefinition: [
        raindrop,
        "collectionID",
      ],
      label: "Collection ID",
      description: "The collection ID",
    },
  },
  async run({ $ }) {
    const collectionID = this.collectionID;
    const response = await this.raindrop.deleteCollection($, collectionID);

    $.export("$summary", `Successfully deleted collection with ID ${collectionID}`);

    return response;
  },
};
