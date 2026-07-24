import app from "../../roblox.app.mjs";

export default {
  key: "roblox-get-data-store-entry",
  name: "Get Data Store Entry",
  description: "Get the value and metadata of a Roblox data store entry. [See the documentation](https://create.roblox.com/docs/cloud/reference/features/storage#Cloud_GetDataStoreEntry__Using_Universes_DataStores)",
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
    entryId: {
      propDefinition: [
        app,
        "entryId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getDataStoreEntry({
      $,
      universeId: this.universeId,
      dataStoreId: this.dataStoreId,
      entryId: this.entryId,
    });
    $.export("$summary", `Retrieved data store entry ${this.entryId}`);
    return response;
  },
};
