import app from "../../asin_data_api.app.mjs";

export default {
  key: "asin_data_api-delete-collection",
  name: "Delete Collection",
  description: "Delete a collection from Asin Data API. [See the documentation](https://docs.trajectdata.com/asindataapi/collections-api/collections/delete)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    collectionId: {
      propDefinition: [
        app,
        "collectionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteCollection({
      $,
      collectionId: this.collectionId,
    });
    $.export("$summary", "Successfully deleted the collection with ID: " + this.collectionId);
    return response;
  },
};
