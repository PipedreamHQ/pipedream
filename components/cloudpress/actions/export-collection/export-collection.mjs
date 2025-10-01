import cloudpress from "../../cloudpress.app.mjs";

export default {
  key: "cloudpress-export-collection",
  name: "Export Collection",
  description: "Exports all content in a collection in Cloudpress. [See the documentation](https://docs.usecloudpress.com/api-reference/endpoint/collections/export)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudpress,
    collectionId: {
      propDefinition: [
        cloudpress,
        "collectionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cloudpress.exportCollection({
      $,
      collectionId: this.collectionId,
    });
    $.export("$summary", `Successfully exported collection with ID ${this.collection}'`);
    return response;
  },
};
