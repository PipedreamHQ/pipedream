import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoho_recruit-create-or-update-record",
  name: "Create or Update Record",
  description: "Creates a new record or updates existing record if already present. [See the documentation](https://www.zoho.com/recruit/developer-guide/apiv2/upsert-records.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  async run({ $ }) {
    const response = await this.zohoRecruit.upsertRecord({
      moduleName: this.module,
      data: this.buildData(),
      $,
    });

    if (response.data[0].code === "MANDATORY_NOT_FOUND") {
      throw new Error(`Mandatory field ${response.data[0].details.api_name} not entered.`);
    }
    if (response.data[0].status === "error") {
      throw new Error(response.data[0].message);
    }

    $.export("$summary", `Successfully upserted record with ID ${response.data[0].details.id}`);

    return response;
  },
};
