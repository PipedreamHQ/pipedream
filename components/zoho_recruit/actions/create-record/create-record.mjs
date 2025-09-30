import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoho_recruit-create-record",
  name: "Create Record",
  description: "Creates a new record. [See the documentation](https://www.zoho.com/recruit/developer-guide/apiv2/insert-records.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  async run({ $ }) {
    const response = await this.zohoRecruit.createRecord({
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

    $.export("$summary", `Successfully created record with ID ${response.data[0].details.id}`);

    return response;
  },
};
