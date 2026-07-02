import app from "../../excalidraw.app.mjs";

export default {
  key: "excalidraw-get-scene",
  name: "Get Scene",
  description:
    "Returns metadata for a specific Excalidraw scene, and optionally its full drawing content (elements JSON)."
    + " Use this when the user asks to view, inspect, or read a specific scene."
    + " Use **List Scenes** first to find the scene ID by name."
    + " Set `includeContent` to true only when the user explicitly asks for the drawing data — the content can be large."
    + " [See the documentation](https://plus.excalidraw.com/docs/api/scenes/sceneId-content-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    sceneId: {
      propDefinition: [
        app,
        "sceneId",
      ],
    },
    includeContent: {
      type: "boolean",
      label: "Include Drawing Content",
      description: "When true, also fetches the scene's drawing elements (the full canvas JSON). Only set this when the user explicitly asks for the drawing content.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const scene = await this.app.getScene({
      $,
      sceneId: this.sceneId,
    });

    if (this.includeContent) {
      const content = await this.app.getSceneContent({
        $,
        sceneId: this.sceneId,
      });
      scene.content = content;
    }

    $.export("$summary", `Retrieved scene: ${scene.metadata?.name || this.sceneId}`);
    return scene;
  },
};
