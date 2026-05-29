import app from "../../excalidraw.app.mjs";

export default {
  key: "excalidraw-create-collection",
  name: "Create Collection",
  description:
    "Creates a new collection (folder) in the Excalidraw Plus workspace for organizing scenes."
    + " Returns the new collection's ID — pass it to **Create Scene** or **Update Scene** to add scenes to this collection."
    + " [See the documentation](https://plus.excalidraw.com/docs/api/collections/post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    collectionName: {
      propDefinition: [
        app,
        "collectionName",
      ],
    },
    collectionDescription: {
      propDefinition: [
        app,
        "collectionDescription",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      name: this.collectionName,
    };
    if (this.collectionDescription) data.description = this.collectionDescription;

    const collection = await this.app.createCollection({
      $,
      data,
    });
    $.export("$summary", `Created collection: ${collection.name || collection.id}`);
    return collection;
  },
};
