import zohoForms from "../../zoho_forms.app.mjs";

export default {
  key: "zoho_forms-list-forms",
  name: "List Forms",
  description: "Fetches the meta information of all the forms present in a Zoho Creator application. [See the documentation](https://www.zoho.com/creator/help/api/v2.1/get-forms.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zohoForms,
  },
  async run({ $ }) {

    const response = await this.zohoForms.listForms();

    $.export("$summary", `Successfully fetched ${response.forms?.length || 0} forms`);
    return response;
  },
};
