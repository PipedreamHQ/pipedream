import app from "../../roblox.app.mjs";
import { idPrefixFilter } from "../../common/utils.mjs";

export default {
  key: "roblox-list-data-stores",
  name: "List Data Stores",
  description: "List the data stores in a Roblox universe. [See the documentation](https://create.roblox.com/docs/cloud/reference/DataStore#Cloud_ListDataStores)",
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
    prefix: {
      propDefinition: [
        app,
        "prefix",
      ],
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
      resourceFn: (args) => this.app.listDataStores({
        $,
        universeId: this.universeId,
        ...args,
      }),
      args: {
        params: {
          filter: idPrefixFilter(this.prefix),
        },
      },
      resourceKey: "dataStores",
      max: this.maxResults,
    });
    $.export("$summary", `Retrieved ${results.length} data store${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
