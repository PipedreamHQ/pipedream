import grist from "../../grist.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "grist-create-update-record",
  name: "Create or Update Record in Grist",
  description: "Creates a new record in a specified table or updates an existing matching record in Grist. [See the documentation](https://support.getgrist.com/api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    grist,
    tableName: {
      propDefinition: [
        grist,
        "tableName",
      ],
    },
    recordData: {
      propDefinition: [
        grist,
        "recordData",
      ],
    },
    matchKeys: {
      propDefinition: [
        grist,
        "matchKeys",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      tableName, recordData, matchKeys,
    } = this;

    const response = await this.grist.createOrUpdateRecord({
      tableName,
      recordData,
      matchKeys,
    });

    $.export("$summary", `Successfully ${matchKeys
      ? "updated"
      : "created"} record in table '${tableName}'`);
    return response;
  },
};
