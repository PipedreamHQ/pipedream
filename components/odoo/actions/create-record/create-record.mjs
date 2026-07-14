import odoo from "../../odoo.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "odoo-create-record",
  name: "Create Record",
  description: "Create a new record in Odoo. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#create-records)",
  version: "1.0.0",
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
    },
    fieldsToSet: {
      type: "object",
      label: "Fields to Set",
      description: "Fields to set for the new record. Field names are the keys, and values are the values to set. Use the **List Record Fields** action to get the field names and their properties.",
    },
  },
  async run({ $ }) {
    const {
      odoo,
      modelName,
      fieldsToSet,
    } = this;

    const payload = parseObject(fieldsToSet);

    const response = await odoo.createRecord(modelName, [
      payload,
    ]);

    $.export("$summary", `Successfully created record with ID: ${response}`);
    return response;
  },
};
