import raindrop from "../../raindrop.app.mjs";

export default {
  key: "raindrop-delete-collection",
  name: "Delete Collection",
  description: "Delete a collection",
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
  async run() {
    const collectionID = this.collectionID?.value ?? this.collectionID;

    return this.raindrop.deleteCollection(collectionID);
  },
};
