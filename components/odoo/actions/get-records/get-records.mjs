import odoo from "../../odoo.app.mjs";

export default {
  key: "odoo-get-records",
  name: "Get Records",
  description: "Get records by ID from Odoo. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#read-records)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    odoo,
    modelName: {
      propDefinition: [
        odoo,
        "modelName",
      ],
    },
    recordIds: {
      type: "integer[]",
      propDefinition: [
        odoo,
        "recordId",
        ({ modelName }) => ({
          modelName,
        }),
      ],
    },
    fields: {
      propDefinition: [
        odoo,
        "fields",
        ({ modelName }) => ({
          modelName,
        }),
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.odoo.readRecords(this.modelName, this.recordIds, this.fields);
    $.export("$summary", `Successfully retrieved ${response.length} record${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
