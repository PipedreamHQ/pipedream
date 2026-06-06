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
    if (!this.nameFilter) {
      const response = await this.app.listScenes({
        $,
        params: {
          collectionId: this.collectionId,
          limit: this.limit,
        },
      });
      const scenes = response.data ?? [];
      $.export("$summary", `Retrieved ${scenes.length} scene(s)`);
      return scenes;
    }

    // When nameFilter is active, paginate to collect enough matches.
    // The user's limit caps how many matches to return (default 100).
    const maxResults = this.limit ?? 100;
    const filter = this.nameFilter.toLowerCase();
    const matches = [];
    let offset = 0;
    let hasNextPage = true;

    while (hasNextPage && matches.length < maxResults) {
      const response = await this.app.listScenes({
        $,
        params: {
          collectionId: this.collectionId,
          limit: 100,
          offset,
        },
      });
      const chunk = response.data ?? [];
      for (const scene of chunk) {
        if (scene.metadata?.name?.toLowerCase().includes(filter)) {
          matches.push(scene);
          if (matches.length === maxResults) break;
        }
      }
      offset += chunk.length;
      hasNextPage = response.hasNextPage && chunk.length > 0;
    }

    $.export("$summary", `Retrieved ${matches.length} scene(s)`);
    return matches;
  },
};
