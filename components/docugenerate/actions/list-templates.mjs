import app from "../docugenerate.app.mjs";

export default {
  key: "docugenerate-list-templates",
  name: "List Templates",
  description: "Retrieves a list of all templates in your DocuGenerate account",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listTemplates($);
    console.log(response);
    return response;
  },
};