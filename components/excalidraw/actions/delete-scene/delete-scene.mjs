import app from "../../excalidraw.app.mjs";

export default {
  key: "excalidraw-delete-scene",
  name: "Delete Scene",
  description:
    "Permanently deletes an Excalidraw scene and all its drawing content. This action cannot be undone."
    + " Use **List Scenes** to find the scene ID before calling this tool."
    + " Confirm with the user before deleting — deleted scenes cannot be recovered."
    + " [See the documentation](https://plus.excalidraw.com/docs/api/scenes/sceneId-delete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
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
  },
  async run({ $ }) {
    const response = await this.app.deleteScene({
      $,
      sceneId: this.sceneId,
    });
    $.export("$summary", `Deleted scene: ${this.sceneId}`);
    return response ?? {
      deleted: true,
      id: this.sceneId,
    };
  },
};
