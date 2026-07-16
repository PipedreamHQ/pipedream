import app from "../../roblox.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "roblox-set-data-store-entry",
  name: "Set Data Store Entry",
  description: "Create or update the value of a Roblox data store entry. [See the documentation](https://create.roblox.com/docs/cloud/reference/features/storage#Cloud_UpdateDataStoreEntry__Using_Universes_DataStores)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
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
    value: {
      type: "string",
      label: "Value",
      description: "The value to store. JSON is parsed automatically, so you can pass a string (`\"hello\"`), a number (`42`), a boolean, an array, or a JSON object (`{\"coins\":100}`).",
    },
    users: {
      propDefinition: [
        app,
        "users",
      ],
    },
    attributes: {
      propDefinition: [
        app,
        "attributes",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.setDataStoreEntry({
      $,
      universeId: this.universeId,
      dataStoreId: this.dataStoreId,
      entryId: this.entryId,
      params: {
        allowMissing: true,
      },
      data: {
        value: parseObject(this.value),
        users: this.users,
        attributes: parseObject(this.attributes),
      },
    });
    $.export("$summary", `Set data store entry ${this.entryId}`);
    return response;
  },
};
