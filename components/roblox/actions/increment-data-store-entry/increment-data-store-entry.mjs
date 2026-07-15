import app from "../../roblox.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "roblox-increment-data-store-entry",
  name: "Increment Data Store Entry",
  description: "Increment the numeric value of a Roblox data store entry by a given amount. The existing value and the increment must both be integers. [See the documentation](https://create.roblox.com/docs/cloud/reference/features/storage#Cloud_IncrementDataStoreEntry__Using_Universes_DataStores)",
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
    amount: {
      type: "integer",
      label: "Amount",
      description: "The amount by which to increment the entry value. Use a negative number to decrement.",
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
    const response = await this.app.incrementDataStoreEntry({
      $,
      universeId: this.universeId,
      dataStoreId: this.dataStoreId,
      entryId: this.entryId,
      data: {
        amount: this.amount,
        users: this.users,
        attributes: parseObject(this.attributes),
      },
    });
    $.export("$summary", `Incremented data store entry ${this.entryId} by ${this.amount}`);
    return response;
  },
};
