import odoo from "../../odoo.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "odoo-create-record",
  name: "Create Record",
  description: "Create a new record in Odoo. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#create-records)",
  version: "0.0.4",
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
    values: {
      type: "string",
      label: "Values",
      description: "JSON mapping of field names to values for the new record. Example: `{\"name\":\"New Partner\",\"email\":\"info@acme.com\"}`.",
      optional: true,
    },
  },
  async additionalProps() {
    return await this.odoo.getFieldProps(this.modelName);
  },
  async run({ $ }) {
    const {
      odoo,
      modelName,
      values,
      ...data
    } = this;
    const parsedValues = parseObject(values);
    if (values && (typeof parsedValues !== "object" || Array.isArray(parsedValues) || parsedValues === null)) {
      throw new Error("Values must be a JSON object mapping field names to values.");
    }
    const payload = {
      ...data,
      ...(parsedValues && typeof parsedValues === "object" && !Array.isArray(parsedValues)
        ? parsedValues
        : {}),
    };
    const response = await odoo.createRecord(modelName, [
      payload,
    ]);
    $.export("$summary", `Successfully created record with ID: ${response}`);
    return response;
  },
};
