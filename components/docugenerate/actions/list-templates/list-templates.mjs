import app from "../../docugenerate.app.mjs";

export default {
  key: "docugenerate-list-templates",
  name: "List Templates",
  description: "Retrieves a list of all templates. [See the documentation](https://api.docugenerate.com/#/Template/queryTemplates)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listTemplates($);

    $.export("$summary", `Successfully retrieved ${response?.length || 0} templates`);
    return response;
  },
};
