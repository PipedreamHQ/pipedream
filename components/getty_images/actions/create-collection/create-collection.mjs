import gettyImages from "../../getty_images.app.mjs";

export default {
  key: "getty_images-create-collection",
  name: "Create Collection",
  description: "Create a new image collection (board) in Getty Images. Provide a name and an optional description. Returns the created collection's ID and metadata. [See the documentation](https://developers.gettyimages.com/docs/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    gettyImages,
    collectionName: {
      propDefinition: [
        gettyImages,
        "collectionName",
      ],
    },
    collectionDescription: {
      propDefinition: [
        gettyImages,
        "collectionDescription",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gettyImages.createCollection({
      $,
      name: this.collectionName,
      description: this.collectionDescription,
    });

    $.export("$summary", `Successfully created collection: ${this.collectionName}`);
    return response;
  },
};
