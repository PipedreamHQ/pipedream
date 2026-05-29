import app from "../../excalidraw.app.mjs";

export default {
  key: "excalidraw-list-scenes",
  name: "List Scenes",
  description:
    "Returns scenes (whiteboards) in the Excalidraw Plus workspace."
    + " Optionally filter by collection ID or apply a name substring filter (applied client-side, since the API has no server-side search)."
    + " When the user says 'scenes in [collection]', use **List Collections** first to get the collection ID, then pass it as `collectionId` here."
    + " Use `nameFilter` (and `limit`) to narrow results when the user asks for a scene by name — the tool fetches up to `limit` scenes and returns only those whose name contains the filter string."
    + " [See the documentation](https://plus.excalidraw.com/docs/api/scenes/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    collectionId: {
      propDefinition: [
        app,
        "collectionId",
      ],
    },
    nameFilter: {
      type: "string",
      label: "Name Filter",
      description: "Filter scenes by name (case-insensitive substring match, applied client-side).",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.collectionId) params.collectionId = this.collectionId;
    if (this.limit) params.limit = this.limit;

    const response = await this.app.listScenes({
      $,
      params,
    });
    let scenes = Array.isArray(response)
      ? response
      : (response.data ?? response.scenes ?? []);

    if (this.nameFilter) {
      const filter = this.nameFilter.toLowerCase();
      scenes = scenes.filter((s) => s.metadata?.name?.toLowerCase().includes(filter));
    }

    $.export("$summary", `Retrieved ${scenes.length} scene(s)`);
    return scenes;
  },
};
