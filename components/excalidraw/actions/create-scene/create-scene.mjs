import app from "../../excalidraw.app.mjs";

export default {
  key: "excalidraw-create-scene",
  name: "Create Scene",
  description:
    "Creates a new scene (whiteboard) in the Excalidraw Plus workspace."
    + " The API requires a collection — if no `collection_id` is provided, the scene is placed in the default (Main) collection automatically."
    + " Use **List Collections** to find the collection ID if the user wants the scene in a specific folder."
    + " Returns the new scene's ID and metadata."
    + " [See the documentation](https://plus.excalidraw.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    sceneName: {
      propDefinition: [
        app,
        "sceneName",
      ],
    },
    collectionId: {
      propDefinition: [
        app,
        "collectionId",
      ],
    },
  },
  async run({ $ }) {
    const collectionId = this.collectionId
      || await this.app.getDefaultCollectionId($);

    const data = {
      name: this.sceneName,
      pinned: false,
      collectionId,
    };

    const scene = await this.app.createScene({
      $,
      data,
    });
    $.export("$summary", `Created scene: ${scene.metadata?.name || scene.metadata?.id}`);
    return scene;
  },
};
