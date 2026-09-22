import mural from "../../mural.app.mjs";

export default {
  key: "mural-search-murals",
  name: "Search Murals",
  description: "Search murals in a workspace. [See the documentation](https://developers.mural.co/public/reference/searchmurals)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mural,
    workspaceId: {
      propDefinition: [
        mural,
        "workspaceId",
      ],
    },
    q: {
      type: "string",
      label: "Search Query",
      description: "The text to search for",
    },
    roomId: {
      propDefinition: [
        mural,
        "roomId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        mural,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      q: this.q,
    };
    if (this.roomId) {
      params.roomId = this.roomId;
    }

    const murals = await this.mural.getPaginatedResults({
      fn: this.mural.searchMurals,
      args: {
        $,
        workspaceId: this.workspaceId,
        params,
      },
      max: this.maxResults,
      limit: null,
    });

    $.export("$summary", `Successfully found ${murals.length} mural${murals.length === 1
      ? ""
      : "s"}`);
    return murals;
  },
};
