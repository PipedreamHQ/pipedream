import app from "../docugenerate.app.mjs";

export default {
  key: "docugenerate-list-templates",
  name: "List Templates",
  description: "Retrieves a list of all templates",
  version: "1.0.0",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listTemplates($);
    
    $.export("$summary", `Successfully retrieved ${response?.length || 0} templates`);
    return response;
  },
};