import odoo from "../../odoo.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "odoo-update-record",
  name: "Update Record",
  description: "Update an existing record in Odoo. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#update-records)",
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
    recordId: {
      propDefinition: [
        odoo,
        "recordId",
        ({ modelName }) => ({
          modelName,
        }),
      ],
    },
    fieldsToUpdate: {
      type: "object",
      label: "Fields to Update",
      description: "Fields to update for the record. Field names are the keys, and values are the values to update. Use the **List Record Fields** action to get the field names and their properties.",
    },
  },
  async run({ $ }) {
    const {
      odoo,
      modelName,
      recordId,
      fieldsToUpdate,
    } = this;

    const payload = parseObject(fieldsToUpdate);
    const ids = [
      recordId,
    ];

    const response = await odoo.updateRecord(modelName, [
      ids,
      payload,
    ]);
    $.export("$summary", `Successfully updated record with ID: ${recordId}`);
    return response;
  },
};
