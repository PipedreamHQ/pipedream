import { ConfigurationError } from "@pipedream/platform";
import app from "../../excalidraw.app.mjs";

export default {
  key: "excalidraw-update-scene",
  name: "Update Scene",
  description:
    "Updates an existing Excalidraw scene's name or collection membership."
    + " Use **List Scenes** to find the scene ID, and **List Collections** to find a collection ID if moving the scene."
    + " Only the fields you provide are updated — omitted fields remain unchanged."
    + " Note: the Excalidraw API does not support a description field on scenes."
    + " [See the documentation](https://plus.excalidraw.com/docs/api/scenes/sceneId-patch)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    sceneId: {
      propDefinition: [
        app,
        "sceneId",
      ],
    },
    sceneName: {
      propDefinition: [
        app,
        "sceneName",
      ],
      optional: true,
    },
    collectionId: {
      propDefinition: [
        app,
        "collectionId",
      ],
    },
    pinned: {
      type: "boolean",
      label: "Pinned",
      description: "Whether to pin the scene to the top of the collection.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.sceneName === undefined && this.collectionId === undefined && this.pinned === undefined) {
      throw new ConfigurationError("Provide at least one of: sceneName, collectionId, pinned.");
    }

    const data = {
      name: this.sceneName,
      collectionId: this.collectionId,
      pinned: this.pinned,
    };

    const scene = await this.app.updateScene({
      $,
      sceneId: this.sceneId,
      data,
    });
    $.export("$summary", `Updated scene: ${scene.metadata?.name || this.sceneId}`);
    return scene;
  },
};
