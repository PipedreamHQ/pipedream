import mural from "../../mural.app.mjs";

export default {
  key: "mural-list-murals",
  name: "List Murals",
  description: "List murals in a workspace. [See the documentation](https://developers.mural.co/public/reference/getworkspacemurals)",
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
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort order for the murals. `lastCreated` returns the most recently created murals first, `lastModified` (for example, to find murals with recent activity) returns the most recently edited first, and `oldest` returns the least recently created first.",
      options: [
        "lastCreated",
        "lastModified",
        "oldest",
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
    const params = {};
    if (this.sortBy) {
      params.sortBy = this.sortBy;
    }

    const murals = await this.mural.getPaginatedResults({
      fn: this.mural.listMurals,
      args: {
        $,
        workspaceId: this.workspaceId,
        params,
      },
      max: this.maxResults,
    });

    $.export("$summary", `Successfully retrieved ${murals.length} mural${murals.length === 1
      ? ""
      : "s"}`);
    return murals;
  },
};
