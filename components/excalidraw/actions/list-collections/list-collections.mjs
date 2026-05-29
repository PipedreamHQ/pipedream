import app from "../../excalidraw.app.mjs";

export default {
  key: "excalidraw-list-collections",
  name: "List Collections",
  description:
    "Returns all collections (folders) in the Excalidraw Plus workspace."
    + " Use this to discover available collection IDs and names before filtering scenes by collection or creating a scene in a specific collection."
    + " Cross-reference: pass a collection ID from this result to **List Scenes** or **Create Scene**."
    + " [See the documentation](https://plus.excalidraw.com/docs/api/collections/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.limit) params.limit = this.limit;

    const response = await this.app.listCollections({
      $,
      params,
    });
    const collections = Array.isArray(response)
      ? response
      : (response.data ?? response.collections ?? []);
    $.export("$summary", `Retrieved ${collections.length} collection(s)`);
    return collections;
  },
};
