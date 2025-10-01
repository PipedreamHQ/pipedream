import dropmark from "../../dropmark.app.mjs";

export default {
  key: "dropmark-get-items-in-collection",
  name: "Get Items in Collection",
  description: "Retrieves a list of items in a specific collection. [See the documentation](https://support.dropmark.com/article/96-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dropmark,
    collectionId: {
      propDefinition: [
        dropmark,
        "collectionId",
      ],
    },
  },
  async run({ $ }) {
    const { items } = await this.dropmark.getCollectionItems({
      $,
      collectionId: this.collectionId,
    });
    $.export("$summary", `Successfully retrieved ${items.length} item${items.length === 1
      ? ""
      : "s"} in collection ${this.collectionId}`);
    return items;
  },
};
