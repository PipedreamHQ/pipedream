import app from "../../roblox.app.mjs";

export default {
  key: "roblox-list-data-store-entries",
  name: "List Data Store Entries",
  description: "List the entries (keys) in a Roblox data store. [See the documentation](https://create.roblox.com/docs/cloud/reference/DataStoreEntry#Cloud_ListDataStoreEntries)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    universeId: {
      propDefinition: [
        app,
        "universeId",
      ],
    },
    dataStoreId: {
      propDefinition: [
        app,
        "dataStoreId",
      ],
    },
    prefix: {
      propDefinition: [
        app,
        "prefix",
      ],
      description: "Only return entries whose ID starts with this prefix.",
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = await this.app.getPaginatedResults({
      resourceFn: (args) => this.app.listDataStoreEntries({
        $,
        universeId: this.universeId,
        dataStoreId: this.dataStoreId,
        ...args,
      }),
      args: {
        params: {
          filter: this.prefix
            ? `id.startsWith("${this.prefix}")`
            : undefined,
        },
      },
      resourceKey: "dataStoreEntries",
      max: this.maxResults,
    });
    $.export("$summary", `Retrieved ${results.length} data store entr${results.length === 1
      ? "y"
      : "ies"}`);
    return results;
  },
};
