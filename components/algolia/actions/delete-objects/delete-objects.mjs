import algolia from "../../algolia.app.mjs";

export default {
  key: "algolia-delete-objects",
  name: "Delete Objects",
  description: "Delete objects from the given index. [See docs here](https://www.algolia.com/doc/api-reference/api-methods/delete-objects/)",
  version: "0.0.1",
  type: "action",
  props: {
    algolia,
    indexName: {
      propDefinition: [
        algolia,
        "indexName",
      ],
    },
    objectIds: {
      label: "Object Ids",
      description: "An array of JavaScript object IDs, each corresponding to a existing object in your search index",
      type: "string[]",
    },
  },
  async run({ $ }) {
    const response = await this.algolia.deleteObjects({
      indexName: this.indexName,
      objectIds: typeof this.objectIds === "string"
        ? JSON.parse(this.objectIds)
        : this.objectIds,
    });

    $.export("$summary", "Successfully deleted objects");

    return response;
  },
};
