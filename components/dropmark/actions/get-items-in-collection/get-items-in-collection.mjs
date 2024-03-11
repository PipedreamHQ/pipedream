import dropmark from "../../dropmark.app.mjs";

export default {
  key: "dropmark-get-items-in-collection",
  name: "Get Items in Collection",
  description: "Retrieves a list of items in a specific collection. [See the documentation](https://support.dropmark.com/article/96-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dropmark,
    username: {
      propDefinition: [
        dropmark,
        "username",
      ],
    },
    collectionId: {
      propDefinition: [
        dropmark,
        "collectionId",
      ],
    },
    personalKey: {
      propDefinition: [
        dropmark,
        "personalKey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dropmark.getCollectionItems({
      username: this.username,
      collectionId: this.collectionId,
      personalKey: this.personalKey,
    });
    $.export("$summary", `Successfully retrieved items in collection ${this.collectionId}`);
    return response;
  },
};
