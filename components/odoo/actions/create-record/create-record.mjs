import odoo from "../../odoo.app.mjs";

export default {
  key: "odoo-create-record",
  name: "Create Record",
  description: "Create a new record in Odoo. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#create-records)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    odoo,
    modelName: {
      propDefinition: [
        odoo,
        "modelName",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    return await this.odoo.getFieldProps(this.modelName);
  },
  async run({ $ }) {
    const {
      odoo,
      modelName,
      ...data
    } = this;
    const response = await odoo.createRecord(modelName, [
      data,
    ]);
    $.export("$summary", `Successfully created record with ID: ${response}`);
    return response;
  },
};
