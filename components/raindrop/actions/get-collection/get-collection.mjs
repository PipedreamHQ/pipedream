import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-get-collection",
  name: "Get Collection",
  description: "Get collection. [See the docs here](https://developer.raindrop.io/v1/collections/methods#get-collection)",
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

    return this.raindrop.getCollection($, collectionID);
  },
};
