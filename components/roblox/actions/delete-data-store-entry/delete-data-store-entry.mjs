import app from "../../roblox.app.mjs";

export default {
  key: "roblox-delete-data-store-entry",
  name: "Delete Data Store Entry",
  description: "Delete an entry from a Roblox data store. [See the documentation](https://create.roblox.com/docs/cloud/reference/DataStoreEntry#Cloud_DeleteDataStoreEntry)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
    entryId: {
      propDefinition: [
        app,
        "entryId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteDataStoreEntry({
      $,
      universeId: this.universeId,
      dataStoreId: this.dataStoreId,
      entryId: this.entryId,
    });
    $.export("$summary", `Deleted data store entry ${this.entryId}`);
    return response;
  },
};
