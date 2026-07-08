import odoo from "../../odoo.app.mjs";

export default {
  key: "odoo-delete-record",
  name: "Delete Record",
  description: "Delete a record from Odoo. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#delete-records)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    odoo,
    modelName: {
      propDefinition: [
        odoo,
        "modelName",
      ],
    },
    recordId: {
      propDefinition: [
        odoo,
        "recordId",
        ({ modelName }) => ({
          modelName,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.odoo.deleteRecord(this.modelName, this.recordId);
    $.export("$summary", `Successfully deleted record ${this.recordId}`);
    return response;
  },
};
