import app from "../../roblox.app.mjs";

export default {
  key: "roblox-list-inventory-items",
  name: "List Inventory Items",
  description: "List the items in a Roblox user's inventory. The user's inventory must be public, or the API key owner must be the user. [See the documentation](https://create.roblox.com/docs/cloud/reference/InventoryItem#Cloud_ListInventoryItems)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
      description: "Filter which inventory items are returned, using the API's [filtering syntax](https://create.roblox.com/docs/cloud/reference/patterns#filtering). For example, `assetTypes=HAT,CLASSIC_PANTS` or `privateServers=true`.",
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
      resourceFn: (args) => this.app.listInventoryItems({
        $,
        userId: this.userId,
        ...args,
      }),
      args: {
        params: {
          filter: this.filter,
        },
      },
      resourceKey: "inventoryItems",
      max: this.maxResults,
    });
    $.export("$summary", `Retrieved ${results.length} inventory item${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
