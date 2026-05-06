import odoo from "../../odoo.app.mjs";

const DEFAULT_ATTRIBUTES = [
  "string",
  "help",
  "type",
];

export default {
  key: "odoo-list-record-fields",
  name: "List Record Fields",
  description:
    "List record fields for a given Odoo model. Use this to discover available fields and select specific attributes (like `string`, `type`, and `help`). Gotchas: this action calls Odoo’s `fields_get` endpoint, so returned fields depend on your Odoo access rights. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#list-record-fields)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    attributes: {
      type: "string[]",
      label: "Attributes",
      description: "A list of field attributes to return (e.g. `['string','type','help']`). Filtering attributes reduces response size.",
      optional: true,
      default: DEFAULT_ATTRIBUTES,
      options: [
        "string",
        "help",
        "type",
        "readonly",
        "required",
        "store",
        "relation",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.odoo.getFields(this.modelName, [], {
      attributes: this.attributes?.length
        ? this.attributes
        : DEFAULT_ATTRIBUTES,
    });
    const fieldCount = Object.keys(response || {}).length;
    $.export("$summary", `Successfully retrieved ${fieldCount} field${fieldCount === 1
      ? ""
      : "s"}`);
    return response;
  },
};
