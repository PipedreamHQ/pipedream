import odoo from "../../odoo.app.mjs";

export default {
  key: "odoo-list-models",
  name: "List Models",
  description: "List all models in Odoo. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#ir-model)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    odoo,
  },
  async run({ $ }) {
    const response = await this.odoo.listModels();
    $.export("$summary", "Successfully listed models");
    return response;
  },
};
